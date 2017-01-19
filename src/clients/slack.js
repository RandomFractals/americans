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
   * Creates Slack message request for our bot api.
   * 
   * @messageBody Slack message post request body.
   */
  createMessage(messageBody) {
  // create Slack message request for our bot api
    const message = {
      sender: {id: messageBody.user_name},
      recipient: {id: messageBody.channel_id},
      message: {text: messageBody.text, attachments: false},
      responseUrl: messageBody.response_url
    };
    console.log('Slack.createMessage(): Slack request:', JSON.stringify(message));
    return message;
  }

  /**
   * Sends Slack message response.
   * 
   * @param recipientId Slack recipient channel or user id.
   * @param messageText Message text to send.
   * @param responseUrl Alternative response url.
   * 
   * @see https://api.slack.com/incoming-webhooks
   */
  sendMessage(recipientId, messageText, responseUrl) {
    // create post message json data
    let messageData = JSON.stringify({
      channel: recipientId,
      username: 'Americans',
      icon_emoji: ':us:',
      response_type: 'in_channel',
      text: messageText
    });

    // send message via incoming Slack webhook url endpoint
    console.log(`Slack.sendMessage(): request: ${messageData}`);
    let postUrl = this.config.SLACK_WEBHOOK_URL;
    if (responseUrl !== null && responseUrl !== undefined) {
      // use provided response url
      postUrl = responseUrl;
    }
    console.log('Slack.sendMessage(): postUrl:', postUrl);
    return fetch(postUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: messageData,
    })
    .then(messageResponse => {
      // see: https://api.slack.com/changelog/2016-05-17-changes-to-errors-for-incoming-webhooks
      console.log(`Slack.sendMessage(): Slack api response: ${messageResponse.status}:${messageResponse.statusText}`);
        //${JSON.stringify(messageResponse)}`);
      return messageResponse;
    });
  } // end of sendMessage()

}

module.exports = Slack;
