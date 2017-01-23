'use strict';

// import api.ai
const apiAI = require('apiai');

// import numeral for numbers formating
const numeral = require('numeral');

// import census data service
const Census = require('../census/census.js');


/**
 * Defines Google api.ai bot agent engine instance.
 */
class BotAI {

  /**
  * Creates new Google api.ai bot agent engine instance for bot chats.
  *
  * @param config Google api.ai bot agent config.
  * @param chatClient Chat client instance, i.e. Messenger, Slack, etc.
  */
  constructor(config, chatClient) {
    // save bot config
    this.config = config;

    // save chat client instance
    this.chatClient = chatClient;

    // create user sessions hash map for tracking user chat history:
    // sessionId -> {userId: userId, context: sessionState}
    this.sessions = {};
    this.censusService = new Census(config);

    // create api ai bot agent instance
    this.botAIClient = apiAI(config.API_AI_TOKEN);

    // send test message
    //chatClient.sendMessage('1165704360144557', 'Hi from api.ai bot');

    console.log(`BotAI(): ${this.chatClient.name} bot AI engine instance created!`);

  } // end of BotAI() constructor


  /*----------------- Bot AI Session, Actions, and Messaging Methods ---------------------*/

  /**
   * Gets user session id for the specified chat user id.
   * 
   * @param userId Chat user id.
   */
  getSessionId(userId) {
    // get user session id
    let sessionId = null;  
    Object.keys(this.sessions).forEach( key => {
      if (this.sessions[key].userId === userId) {
        sessionId = key;
      }
    });

    if (!sessionId) {
      // create new user session
      sessionId = new Date().toISOString();
      this.sessions[sessionId] = {userId: userId, context: {}};
    }
    console.log(`BotAI.getSessionId(): sessionId=${sessionId}`);

    return sessionId;
  }

  /**
   * Logs wit.ai message text request, context, and entities 
   * for interactive bot ai story testing.
   */
  logBotInfo(context, entities, text) {
    console.log(`\t message: ${text}`);  
    console.log(`\t context: ${JSON.stringify(context)}`);
    console.log(`\t entities: ${JSON.stringify(entities)}\n`);
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
  processMessage(message) {
    // get sender user id and recipient id
    const senderId = message.sender.id;
    const recipientId = message.recipient.id;

    // get message text, attachments, and timestamp
    const {text, attachments} = message.message;
    const messageTime = message.timestamp;

    // get user session id for chat history lookup
    const sessionId = this.getSessionId(senderId);

    // save response url for send message calls later
    this.sessions[sessionId].responseUrl = message.responseUrl;

    if (attachments) {
      return this.chatClient.sendMessage(senderId, 'Sorry I can only process text messages for now.')
        .catch(console.error);
    } else if (text) {
      // forward message to wit.ai bot engine to run it through all bot ai actions
      console.log(`BotAI.processMessage(): "${text}" for:${senderId}`);

      const botAIRequest = this.botAIClient.textRequest(text, {
        sessionId: sessionId
      });

      botAIRequest.on('response', function(response) {
        console.log('BotAI.processMessage(): bot AI response:', response);
        console.log('BotAI.processMessage(): intent:', response.result.metadata.intentName);
        console.log('BotAI.processMessage(): params:', response.result.parameters);
      });

      botAIRequest.on('error', function(error) {
        console.log(error);
      });

      botAIRequest.end();
    } else {
      //console.error('BotAI.processMessage(): missing message text!');    
      throw new Error('Missing message text.');
    }

  } // end of processMessage()

} // end of BotAI class

module.exports = BotAI;
