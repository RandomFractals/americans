'use strict';

// import bot brains
const BotAIFactory = require('../bot-ai/bot-ai-factory.js');

/**
 * Defines Slack class for Slack chats.
 * 
 * @see https://api.slack.com/slack-apps
 * @see https://api.slack.com/custom-integrations
 */
class Slack {

  /**
  * Creates new Slack bot client instance for Slack chat.
  *
  * @param config Slack bot config.
  */
  constructor(config) {
    // save bot config
    this.config = config;

    // get bot AI engine instance
    this.botAI = new BotAIFactory(config, this).botAI;
  }


  /**
   * Processes Slack chat bot pings.
   * 
   * @param message Slack bot ping message request.
   */
  processMessage(message) {
    // get sender and recipient Slack user ids
    const senderId = message.sender.id;
    const recipientId = message.recipient.id;

    // get message text, attachments, and timestamp
    const {text, attachments} = message.message;
    const messageTime = message.timestamp;

    if (attachments) {
      return sendMessage(senderId, 'Sorry I can only process text messages for now :(')
        .catch(console.error);
    } else if (text) {
      // forward message to wit.ai bot engine to run it through all bot ai actions
      console.log(`Slack.processMessage(): "${text}" for:${senderId}`);
      return this.botAI.processMessage(message, this);
    } else {
      //console.error('Messenger.processMessage(): missing message text!');    
      throw new Error('Missing message text.');
    }
  } // end of processMessage()


  /**
   * Sends Slack message response.
   * 
   * @param recipientId Slack recipient channel or user id.
   * @param messageText Message text to send.
   * 
   * @see https://api.slack.com/incoming-webhooks
   */
  sendMessage(recipientId, messageText) {
    // create post message json data
    let messageData = JSON.stringify({
      channel: '#americans', // recipientId
      username: 'AmericansBot',
      icon_emoji: ':ghost:',
      text: messageText
    });

    // send message via incoming Slack webhook url endpoint
    console.log(`Slack.sendMessage(): request:${messageData}`);
    const webHookUrl = this.config.SLACK_WEBHOOK_URL;
    return fetch(webHookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: messageData,
    })
    .then(messageResponse => {
      console.log(`Messenger.sendMessage(): response:${messageResponse}`);
      return messageResponse;
    });
  } // end of sendMessage()

}

//export {Slack as default}
// use old school for jest.js
exports["default"] = Slack;
module.exports = exports["default"];
