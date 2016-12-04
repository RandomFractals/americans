'use strict';

// crypto lib import for FB requests verification
const crypto = require('crypto');

// wit.ai imports
const {Wit, log} = require('node-wit');

// app config
const config = require('./config.js');

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
      console.log(`Messenger.send(): to:${recipientId} text:"${text}"`);
      return sendMessage(recipientId, text)
        .then(() => null)
        .catch((err) => {
          console.error('Messenger.send(): Error forwarding message response to:',
            recipientId, err.stack || err);
        });
    } else {
      console.error(`Messenger.send(): Failed to get user id for session: ${sessionId}`);
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
  console.log(`Messenger.sendMessage(): ${messageData}`);
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
    console.log(`Messenger.processMessage(): "${text}" for:${senderId}`);
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
        console.error('Messenger.processMessage(): Wit.ai error: ', err.stack || err);
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
      throw new Error('Invalid x-hub-signature.');
    }

  } else {    
    // log FB request validation error
    console.error('Messenger.verifyFacebookRequestSignature(): Missing x-hub-signature header.');
    // throw an error instead ???
    res.sendStatus(400); 
  }
  
} // end of verifyFacebookRequestSignature()


// export public module functions
module.exports = {
  verifyFacebookRequestSignature: verifyFacebookRequestSignature,
  processMessage: processMessage
};