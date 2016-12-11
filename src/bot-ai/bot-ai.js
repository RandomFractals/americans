'use strict';

// app config
const config = require('../utils/config.js');

// TODO: decouple this eventually generic Bot AI setup 
// from default FB messenger.js interface;
// P.S.: convert them all to es6 classes too!
const messenger = require('../clients/messenger.js');

// wit.ai imports
const {Wit, log} = require('node-wit');

/*----------------- Bot AI Session, Actions, and Messaging Methods ---------------------*/

// create user sessions hash map for tracking user chat history:
// sessionId -> {userId: userId, context: sessionState}
const sessions = {};

// create wit.ai bot actions for now
const actions = {
  send({sessionId}, {text}) {
    // get chat user id from user session
    console.log(`BotAi.send(): request:${text}`);
    const recipientId = sessions[sessionId].userId;
    if (recipientId) {
      // send bot message response
      console.log(`BotAI.send(): to:${recipientId} text:"${text}"`);
      return messenger.sendMessage(recipientId, text)
        .then(() => null)
        .catch((err) => {
          console.error('BotAI.send(): Error forwarding message response to:',
            recipientId, err.stack || err);
        });
    } else {
      console.error(`BotAI.send(): Failed to get user id for session: ${sessionId}`);
      // return promise to return control back to bot ai api
      return Promise.resolve()
    }
  },
  // TODO: implement our custom bot actions here
  // see https://wit.ai/docs/quickstart
};

// use wit.ai bot api for now
// TODO: add configurable bot AI factory and config load
// for using wit.ai, api.ai, or botkit.js later
const witAiClient = new Wit({
  accessToken: config.WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});


/**
 * Gets user session id for the specified chat user id.
 * 
 * @param userId Chat user id.
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
  console.log(`BotAI.getSessionId(): sessionId=${sessionId}`);

  return sessionId;
}


/*---------------------- Public Bot AI Interface Methods ------------------------------*/

/**
 * Processes chat message inquiry.
 * 
 * @param message Chat message request.
 * @param chatClient Chat client instance, i.e. Messenger, Slack, etc.
 * 
 * see https://developers.facebook.com/docs/messenger-platform/webhook-reference
 */
function processMessage(message, chatClient) {
  // get sender user id and recipient id
  const senderId = message.sender.id;
  const recipientId = message.recipient.id;

  // get message text, attachments, and timestamp
  const {text, attachments} = message.message;
  const messageTime = message.timestamp;

  // get user session id for chat history lookup
  const sessionId = getSessionId(senderId);

  if (attachments) {
    messenger.sendMessage(senderId, 'Sorry I can only process text messages for now.')
      .catch(console.error);
  } else if (text) {
    // forward message to wit.ai bot engine to run it through all bot ai actions
    console.log(`BotAI.processMessage(): "${text}" for:${senderId}`);
    witAiClient.runActions(sessionId, text, // msg text
          sessions[sessionId].context) // chat history state
      .then( (context) => {
        // TODO: reset user session based on current session state
        // and last message request as needed
        /*if (context['done']) {
          delete sessions[sessionId];
        }*/
        console.log( JSON.stringify(context) );
        // update user session state
        sessions[sessionId].context = context;
      })
      .catch( (err) => {
        console.error('BotAI.processMessage(): Wit.ai error: ', err.stack || err);
      });
  } else {
    console.error('BotAI.processMessage(): missing message text!');    
    throw new Error('Missing message text.');
  }

} // end of processMessage()


// export public module functions
module.exports = {
  processMessage: processMessage
};