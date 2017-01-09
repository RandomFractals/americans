'use strict';

// import wit.ai bot brains
const WitAI = require('./wit-ai.js');

// TODO: add Google api.ai later

/**
 * Defines bot AI factory for creating different bot AI engine instances.
 */
class BotAIFactory {

  /**
  * Creates new bot AI factory and bot AI engine instance based on config.
  *
  * @param config Bot AI factory config.
  * @param chatClient Chat client instance, i.e. Messenger, Slack, etc.
  */
  constructor(config, chatClient) {
    // save bot ai config and chat client instance ref
    this.config = config;
    this.chatClient = chatClient;
    this.botAI = BotAIFactory.getBotAI(config.BOT_AI);
  }


  /**
   * Gets configured bot AI engine instance.
   * 
   * @param botAIName Configured bot ai name.
   */
  static getBotAI(botAIName) {
    if (BotAIFactory.botAI !== null ) {
      return BotAIFactory.botAI;
    }
    
    // create bot AI engine instance
    switch (botAIName) {
      case 'api.ai':
        // TODO
      case 'wit.ai':
      default: // wit.ai
        //console.log('BotAIFactory:creating WitAI bot engine instance...');
        BotAIFacotry.botAI = new WitAI(config, chatClient);
    }
    return BotAIFactory.botAI;
  }

}


//export {BotAIFactory as default}
// use old school for jest.js
exports["default"] = BotAIFactory;
module.exports = exports["default"];
