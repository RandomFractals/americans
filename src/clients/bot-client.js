'use strict';

// load bot AI factory module
const botAIFactory = require('../bot-ai/bot-ai-factory.js');

/**
 * Defines Bot client base class for Messenger, Slack, and Telegram chats.
 */
class BotClient {

  /**
  * Creates new Bot client chat instance for Messenger, Slack, and Telegram chats.
  *
  * @param config Bot config.
  * @param name Chat client instance name.
  */
  constructor (config, name) {
    // save bot config
    this.config = config;

    // save chat client name for debug
    this.name = name;

    // get bot AI engine instance
    this.botAI = botAIFactory.getBotAI(config, this);

    console.log(`BotClient(): ${name} chat client instance created!`)
  }


  /**
   * Processes bot message pings.
   * 
   * @param message Bot message request.
   */
  processMessage(message) {
    // get sender and recipient user ids
    const senderId = message.sender.id;
    const recipientId = message.recipient.id;

    // get message text, attachments, and timestamp
    const {text, attachments} = message.message;
    const messageTime = message.timestamp;

    if (attachments) {
      return sendMessage(senderId, 'Sorry I can only process text messages for now :(')
        .catch(console.error);
    } else if (text) {
      // forward message to configured bot.ai engine to run it through all bot ai actions
      console.log(`BotClient.processMessage():${this.name}: "${text}" for:${senderId}`);
      return this.botAI.processMessage(message, this);
    } else {
      //console.error('BotClient.processMessage(): missing message text!');
      throw new Error('Missing message text.');
    }
  } // end of processMessage()

}

module.exports = BotClient;
