'use strict';

// express app imports
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');

// wit.ai imports
const {Wit, log} = require('node-wit');

// app config
const config = require('./config.js');

// set web server port
const PORT = process.env.PORT || 8445;

// create and start express web app
const app = express();
app.use(({method, url}, response, next) => {
  response.on('finish', () => {
    console.log(`${response.statusCode} ${method} ${url}`);
  });
  next();
});

// verify FB request signature for all requests
app.use( bodyParser.json( {verify: verifyFacebookRequestSignature}));

// listen for requests
app.listen(PORT);
console.log(`index.js::Listening on port: ${PORT}...`);


/*----------------- Wit.AI Session and FB Webhook Methods ---------------------*/

// create user sessions hash map for tracking chat history:
// sessionId -> {userId: facebookUserId, context: sessionState}
const sessions = {};

// create wit.ai bot actions
const actions = {
  send({sessionId}, {text}) {
    // get fb user id from user session
    const recipientId = sessions[sessionId].userId;
    if (recipientId) {
      // send bot message response
      console.log(`send::sending message to: ${recipientId} text: "${text}"`);
      return sendMessage(recipientId, text)
        .then(() => null)
        .catch((err) => {
          console.error('send::Error forwarding message response to:',
            recipientId, err.stack || err);
        });
    } else {
      console.error(`send::Failed to get user id for session: ${sessionId}`);
      // return promise to return control back to bot api
      return Promise.resolve()
    }
  },
  // TODO: implement our custom bot actions here
  // see https://wit.ai/docs/quickstart
};

// create wit.ai bot client
const witAiClient = new Wit({
  accessToken: config.WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});


// create /webhook get endpoint for FB page subscription verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
    console.log('/webhook::GET:validating webhook...');        
    // send hub.challenge back to confirm fb verify token validation
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('/webhook::GET:Failed /webhook validation. Make sure your validation tokens match!');
    res.sendStatus(400); // or 403 - forbidden
  }
});

// FB message post request handler
app.post('/webhook', (req, res) => {
  // get Messenger request payload
  const data = req.body;
  if (data.object === 'page') {
    // iterate over each entry - there may be multiple if batched
    data.entry.forEach(entry => {
      // process messaging requests 
      entry.messaging.forEach( event => {
        if (event.message && !event.message.is_echo) {
          processMessage(event);
        } else if (event.message && event.message.is_echo) {
          console.log('/webhook::POST:echo message sent:', JSON.stringify(event));
        } else if (event.read) {
          console.log('/webhook::POST:message read:', JSON.stringify(event));
        } else {
          console.log('/webhook::POST:Unknown message event request:', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
});


/**
 * Processes Messenger events.
 * 
 * @event Messenger event.
 * 
 * see https://developers.facebook.com/docs/messenger-platform/webhook-reference
 */
function processMessage(event) {
  // get sender FB user id and recipient id
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;

  // get message text, attachments, and timestamp
  const {text, attachments} = event.message;
  const messageTime = event.timestamp;

  // get user session id for chat history lookup
  const sessionId = getSessionId(senderId);

  if (attachments) {
    sendMessage(sender, 'Sorry I can only process text messages for now.')
      .catch(console.error);
  } else if (text) {
    // forward message to wit.ai bot engine to run it through all bot ai actions
    console.log(`processMessage::processing message: "${text}" for: ${senderId}`);
    witAiClient.runActions(sessionId, text, // msg text
          sessions[sessionId].context) // chat history state
      .then( (context) => {
        // TODO: reset user session based on current session state
        // and last message request as needed
        /*if (context['done']) {
          delete sessions[sessionId];
        }*/

        // update user session state
        sessions[sessionId].context = context;
      })
      .catch( (err) => {
        console.error('processMessage:: Wit.ai error: ', err.stack || err);
      });
  }

} // end of processMessage()


/*
 * Verifies Facebook callback request using encrypted
 * x-hub-signature header SHA1 hash message authentication code (HMAC)
 * and facebook app secret key for decryption. 
 *
 * see https://developers.facebook.com/docs/graph-api/webhooks#setup
 */
function verifyFacebookRequestSignature(req, res, buf) {
  // get FB hub signature header
  var signature = req.headers['x-hub-signature'];
  if ( signature != null ) {
    // extract SHA1 hash code from x-hub-signature: sha1=<hash>
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    // create expected hash code
    var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET).update(buf).digest('hex');
    if (signatureHash != expectedHash) {
      throw new Error('verifyFacebookRequestSignature::Invalid x-hub-signature.');
    }

  } else {    
    // log FB request validation error
    console.error('verifyFacebookRequestSignature::Missing x-hub-signature header.');
    // throw an error instead ???
    res.sendStatus(400); 
  }
  
} // end of verifyFacebookRequestSignature()


/**
 * Gets user session id for the specified FB user id.
 * 
 * @param userId FB user id.
 */
function getSessionId(userId){
  // get user session id
  let sessionId = null;  
  Object.keys(sessions).forEach( key => {
    if (sessions[key].userId === userId) {
      sessionId = key;
    }
  });

  if (!sessionId) {
    // create new user session
    sessionId = new Date().toISOString();
    sessions[sessionId] = {userId: userId, context: {}};
  }
  return sessionId;
}


/**
 * Sends FB message.
 * 
 * @param recipientId FB recipient user id.
 * @param messageText Message text to send.
 * 
 * see https://developers.facebook.com/docs/messenger-platform/send-api-reference
 */
function sendMessage(recipientId, messageText) {
  // create post message json data
  let messageData = JSON.stringify({
    recipient: {id: recipientId},
    message: {text: messageText}
  });

  // create messenger page token query params 
  let queryParams = 'access_token=' + encodeURIComponent(config.FB_PAGE_TOKEN);

  // send message via FB messages graph api
  console.log(`sendMessage::sending message: ${messageData}`);
  return fetch('https://graph.facebook.com/me/messages?' + queryParams, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: messageData,
  })
  .then(messageResponse => messageResponse.json())
  .then(messageJsonResponse => {
    if ( messageJsonResponse.error && messageJsonResponse.error.message ) {
      throw new Error(messageJsonResponse.error.message);
    }
    return messageJsonResponse;
  });
} // end of sendMessage()