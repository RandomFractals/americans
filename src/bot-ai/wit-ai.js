'use strict';

// wit.ai imports
const {Wit, log} = require('node-wit');

/**
 * Defines wit.ai bot engine instance.
 */
class WitAI {

  /**
  * Creates new wit.ai bot engine instance for bot chats.
  *
  * @param config wit.ai bot config.
  * @param chatClient Chat client instance, i.e. Messenger, Slack, etc.
  */
  constructor(config, chatClient) {
    // save bot config
    this._config = config;

    // save chat client instance
    this._chatClient = chatClient;

    // create user sessions hash map for tracking user chat history:
    // sessionId -> {userId: userId, context: sessionState}
    const sessions = {};
    this._sessions = sessions;
    const logBotInfo = this.logBotInfo;

    // create wit.ai bot actions
    const actions = {
      send({sessionId, context}, {text}) {
        // get chat user id from user session
        console.log(`BotAi.send(): response:"${text}"`);
        const recipientId = sessions[sessionId].userId;
        if (recipientId) {
          // send bot message response
          console.log(`BotAI.send(): to:${recipientId} response:"${text}"`);
          return chatClient.sendMessage(recipientId, text)
            //.then(() => null)
            .then( () => {
              console.log(`BotAI.send(): ${text} message sent!`);
            })
            .catch((err) => {
              console.error('BotAI.send(): Error forwarding message response to:',
                recipientId, err.stack || err);
            });
        } else {
          console.error(`BotAI.send(): Failed to get user id for session: ${sessionId}`);
          // return promise to return control back to bot ai api
          return Promise.resolve();
        }
      },
      greeting({sessionId, context, text, entities}) {
        console.log(`\n> bot.greeting("${text}"):`);
        console.log(`\t sessionId: ${sessionId}`);
        logBotInfo(context, entities, text);
        return Promise.resolve(context);
      },
      getPopulation({sessionId, context, text, entities}) {
        let location = 'USA'; 
        // TODO: extract requested location 
        // for census pop data service call from entities
        console.log(`\n> bot.getPopulation(("${location}"):`);
        logBotInfo(context, entities, text);
      },
      thanks({sessionId, context, text, entities}) {
        console.log(`\n> bot.thanks("${text}"):`);
        logBotInfo(context, entities, text);
      },    
      disconnect({sessionId, context, text, entities}) {
        console.log(`\n> bot.disconnect("${text}"):`);
        logBotInfo(context, entities, text);
      }
      
      // TODO: add other custom bot actions here
      // see https://wit.ai/docs/quickstart
    };

    // use wit.ai bot api for now
    // TODO: add configurable bot AI factory and config load
    // for using wit.ai, api.ai, or botkit.js later
    this._witAiClient = new Wit({
      accessToken: config.WIT_TOKEN,
      actions,
      logger: new log.Logger(log.INFO)
    });

    // send test message
    //chatClient.sendMessage('1165704360144557', 'Hi from wit.ai bot');

    console.log('WitAI bot engine instance created!');

  } // end of WitAI() constructor


  /*----------------- Bot AI Session, Actions, and Messaging Methods ---------------------*/

  /**
   * Gets user session id for the specified chat user id.
   * 
   * @param userId Chat user id.
   */
  getSessionId(userId) {
    // get user session id
    let sessionId = null;  
    Object.keys(this._sessions).forEach( key => {
      if (this._sessions[key].userId === userId) {
        sessionId = key;
      }
    });

    if (!sessionId) {
      // create new user session
      sessionId = new Date().toISOString();
      this._sessions[sessionId] = {userId: userId, context: {}};
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

    if (attachments) {
      return this.chatClient.sendMessage(senderId, 'Sorry I can only process text messages for now.')
        .catch(console.error);
    } else if (text) {
      // forward message to wit.ai bot engine to run it through all bot ai actions
      console.log(`BotAI.processMessage(): "${text}" for:${senderId}`);
      return this._witAiClient.runActions(sessionId, text, // msg text
            this._sessions[sessionId].context) // chat history state
        .then( (context) => {
          // TODO: reset user session based on current session state
          // and last message request as needed
          /*if (context['done']) {
            delete sessions[sessionId];
          }*/
          console.log( JSON.stringify(context) );
          // update user session state
          this._sessions[sessionId].context = context;
          return context;
        })
        .catch( (err) => {
          console.error('BotAI.processMessage(): Wit.ai error: ', err.stack || err);
        });
    } else {
      //console.error('BotAI.processMessage(): missing message text!');    
      throw new Error('Missing message text.');
    }

  } // end of processMessage()

}

//export {WitAI as default}
// use old school for jest.js
exports["default"] = WitAI;
module.exports = exports["default"];
