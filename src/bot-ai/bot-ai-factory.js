'use strict';

// import wit.ai bot brains
const WitAI = require('./wit-ai.js');

// create bots
const _bots = new Map();

/**
 * Gets configured bot AI engine for a chat client instance.
 * 
 * @param config Bot AI config.
 * @param chatClient Chat client instance.
 */
const getBotAI = function(config, chatClient) {
  if (_bots.has(chatClient.name)) {
    return _bots.get(chatClient.name);
  }
    
  // create bot AI engine instance
  switch (config.BOT_AI) {
    case 'api.ai':
      // TODO: add Google api.ai bot engine support
    case 'wit.ai':
    default: // wit.ai
      console.log(`BotAIFactory:getBotAI(): creating WitAI('${chatClient.name}') bot engine instance...`);
      _bots.set(chatClient.name, new WitAI(config, chatClient) );
  }
  return _bots.get(chatClient.name);
}

module.exports = {getBotAI: getBotAI};