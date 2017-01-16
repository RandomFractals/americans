'use strict';

// import bot client base class
const BotClient = require('./bot-client.js');

/**
 * Defines Telegram class for Telegram bot chats.
 * 
 * @see https://core.telegram.org/bots/api
 */
class Telegram extends BotClient {

  /**
  * Creates new Telegram bot client instance for Telegram ping chats.
  *
  * @param config Telegram bot config.
  */
  constructor(config) {
    super(config, 'Telegram'); // chat client name
  }


  /**
   * Sends Telegram message response.
   * 
   * @param recipientId Telegram recipient channel or user id.
   * @param messageText Message text to send.
   */
  sendMessage(recipientId, messageText) {
    // create post message json data
    let messageData = JSON.stringify({
      channel: recipientId,
      username: 'Americans',
      icon_emoji: ':us:',
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
      console.log(`Slack.sendMessage(): response:${messageResponse}`);
      return messageResponse;
    });
  } // end of sendMessage()

}

module.exports = Telegram;
