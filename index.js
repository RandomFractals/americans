'use strict';

// imports
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const {Wit, log} = require('node-wit');

// initialize .env vars
require('dotenv').config();

// NOTE: set up your .env first
// see .env.template for more info

// set web server port
const PORT = process.env.PORT || 8445;

// get Wit.ai token from config
const WIT_TOKEN = process.env.WIT_TOKEN;

// get FB page token and app secret
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const FB_APP_SECRET = process.env.FB_APP_SECRET;

if (!FB_PAGE_TOKEN) { 
  throw new Error('missing FB_PAGE_TOKEN'); 
}
if (!FB_APP_SECRET) { 
  throw new Error('missing FB_APP_SECRET');
}

// create FB /webhook subscription verification token
// see https://developers.facebook.com/docs/graph-api/webhooks#setup
let FB_VERIFY_TOKEN = null;
crypto.randomBytes(8, (err, buff) => {
  if (err) throw err;
  FB_VERIFY_TOKEN = buff.toString('hex');
  console.log(`FB /webhook Verify Token: ${FB_VERIFY_TOKEN}`);
});

// create user sessions hash map for saving chat history:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

// create wit.ai bot actions
const actions = {
  send({sessionId}, {text}) {
    // get fb user id from user session
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // send bot message response
      return sendMessage(recipientId, text)
        .then(() => null)
        .catch((err) => {
          console.error('Oops! An error occurred while forwarding msg response to',
            recipientId, ':', err.stack || err);
        });
    } else {
      console.error(`Oops! Couldn\'t find user for session: ${sessionId}`);
      // return promise to return control back to bot api
      return Promise.resolve()
    }
  },
  // TODO: implement our custom bot actions here
  // see https://wit.ai/docs/quickstart
};

// create wit.ai bot client
const witAiClient = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});

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

// create webhook endpoint for FB page subscription verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    // send hub.challenge back to confirm fb verify token validation
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed webhook validation. Make sure your validation tokens match.');
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
        } else {
          console.log('Received unknown event', JSON.stringify(event));
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
    // forward message to wit.ai bot engine to run through all bot ai actions
    witAiClient.runActions(sessionId, text, // msg text
          sessions[sessionId].context) // chat history state
      .then((context) => {
        // TODO: reset user session based on current session state
        // and last message request as needed
        /*if (context['done']) {
          delete sessions[sessionId];
        }*/

        // update user session state
        sessions[sessionId].context = context;
      })
      .catch((err) => {
        console.error('Oops! Got an error from Wit.ai: ', err.stack || err);
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
    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET).update(buf).digest('hex');
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate x-hub request signature.");
    }

  } else {    
    // log FB request validation error
    console.error("Couldn't validate Facebook x-hub-signature. See https://developers.facebook.com/docs/graph-api/webhooks#setup");
    // throw an error instead ???
    res.sendStatus(400); 
  }
  
} // end of verifyFacebookRequestSignature()


/**
 * Gets user session id for the specified FB user id.
 * 
 * @param FB user id.
 */
function getSessionId(fbid){
  // get user session id
  let sessionId;  
  Object.keys(sessions).forEach(key => {
    if (sessions[key].fbid === fbid) {
      sessionId = key;
    }
  });

  if (!sessionId) {
    // create new user session
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
}


/**
 * Sends FB message.
 * 
 * @param recipientId FB recipient user id.
 * @param text Message text.
 * 
 * see https://developers.facebook.com/docs/messenger-platform/send-api-reference
 */
function sendMessage(recipientId, text) {
  // create message body json
  let message = JSON.stringify({
    recipient: {recipientId},
    message: {text},
  });

  // create messenger page token query params 
  let queryParams = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);

  // send message via FB graph messages api
  return fetch('https://graph.facebook.com/me/messages?' + queryParams, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    message,
  })
  .then(messageResponse => messageResponse.json())
  .then(messageJsonResponse => {
    if ( messageJsonResponse.error && messageJsonResponse.error.message ) {
      throw new Error(messageJsonResponse.error.message);
    }
    return messageJsonResponse;
  });
} // end of sendMessage()


// listen for requests
app.listen(PORT);
console.log(`Listening on port: ${PORT}...`);
