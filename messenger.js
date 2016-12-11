'use strict';

// app config
const config = require('./config.js');

// crypto lib import for FB requests verification
//const crypto = require('crypto');

// import bot brains
const botAi = require('./bot-ai.js');


/**
 * Defines Messenger class for FB page chats.
 */
class Messenger {

  /**
  * Creates new Messenger instance for FB page chat.
  */
  constructor(config) {
    this.config = config;
  }

  /*
  * Verifies Facebook callback request using encrypted
  * x-hub-signature header SHA1 hash message authentication code (HMAC)
  * and facebook app secret key for decryption. 
  *
  * see https://developers.facebook.com/docs/graph-api/webhooks#setup
  */
  verifyRequestSignature(req, res, buf) {
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
      console.error('Messenger.verifyRequestSignature(): Missing x-hub-signature header.');
      // throw an error instead ???
      res.sendStatus(400); 
    }
    
  } // end of verifyRequestSignature()


  /**
   * Processes Messenger chat bot pings.
   * 
   * @param message Messenger bot ping message request.
   * 
   * see https://developers.facebook.com/docs/messenger-platform/webhook-reference
   */
  processMessage(message) {
    // get sender and recipient FB user ids
    const senderId = message.sender.id;
    const recipientId = message.recipient.id;

    // get message text, attachments, and timestamp
    const {text, attachments} = message.message;
    const messageTime = message.timestamp;

    if (attachments) {
      sendMessage(senderId, 'Sorry I can only process text messages for now :(')
        .catch(console.error);
    } else if (text) {
      // forward message to wit.ai bot engine to run it through all bot ai actions
      console.log(`Messenger.processMessage(): "${text}" for:${senderId}`);
      botAi.processMessage(message, this);
    } else {
      console.error('Messenger.processMessage(): missing message text!');    
      throw new Error('Missing message text.');
    }
  } // end of processMessage()


  /**
   * Sends FB message response.
   * 
   * @param recipientId FB recipient user id.
   * @param messageText Message text to send.
   * 
   * see https://developers.facebook.com/docs/messenger-platform/send-api-reference
   */
  sendMessage(recipientId, messageText) {
    // create post message json data
    let messageData = JSON.stringify({
      recipient: {id: recipientId},
      message: {text: messageText}
    });

    // create messenger page token query params 
    let queryParams = 'access_token=' + encodeURIComponent(config.FB_PAGE_TOKEN);

    // send message via FB messages graph api
    console.log(`Messenger.sendMessage(): request:${messageData}`);
    return fetch('https://graph.facebook.com/me/messages?' + queryParams, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: messageData,
    })
    .then(messageResponse => messageResponse.json())
    .then(messageJsonResponse => {
      console.log(`Messenger.sendMessage(): response:${JSON.stringify(messageJsonResponse)}`);
      if ( messageJsonResponse.error && messageJsonResponse.error.message ) {
        throw new Error(messageJsonResponse.error.message);
      }
      return messageJsonResponse;
    });
  } // end of sendMessage()

}

//export {Messenger as default}
// use old school for jest.js
exports["default"] = Messenger;
module.exports = exports["default"];
