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
    // save bot ai config
    this._config = config;

    // create bot AI engine instance
    switch (config.BOT_AI) {      
      case 'api.ai':
        // TODO
      case 'wit.ai':
      default: // wit.ai
        console.log('BotAIFactory:creating WitAI bot engine instance...');
        this._botAI = new WitAI(config, chatClient);
        break;        
    }
  }


  /**
   * Gets bot AI config.
   */
  get config() {
    return this._config;
  }


  /**
   * Gets configured bot AI engine instance.
   */
  get botAI() {
    return this._botAI;
  }
}


//export {BotAIFactory as default}
// use old school for jest.js
exports["default"] = BotAIFactory;
module.exports = exports["default"];
