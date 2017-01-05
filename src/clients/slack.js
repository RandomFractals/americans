'use strict';

// import bot client base class
const BotClient = require('./bot-client.js');

/**
 * Defines Slack class for Slack chats.
 * 
 * @see https://api.slack.com/slack-apps
 * @see https://api.slack.com/custom-integrations
 */
class Slack extends BotClient {

  /**
  * Creates new Slack bot client instance for Slack chats.
  *
  * @param config Slack bot config.
  */
  constructor(config) {
    super(config, 'Slack'); // chat client name
  }


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

//export {Slack as default}
// use old school for jest.js
exports["default"] = Slack;
module.exports = exports["default"];
