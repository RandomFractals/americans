jest.dontMock('../../src/bot-ai/bot-ai-factory.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Messenger interface instance
const Messenger = require('../../src/clients/messenger.js');
const messenger = new Messenger(config);

// load bot AI factory module
const botAIFactory = require('../../src/bot-ai/bot-ai-factory.js');

describe('Bot AI Factory Interface Tests', () => {

  it('has getBotAI() method defined', () => {
    expect(botAIFactory.getBotAI).toBeDefined();
  });

  const messengerBotAI = botAIFactory.getBotAI(config, messenger); // chat client
  it('can create Messenger bot AI engine instance', () => {
    expect(botAIFactory.getBotAI(config, messenger)).not.toBeNull();
  });

  it('has a chat client associated with it', () => {
    expect(botAIFactory.getBotAI(config, messenger).chatClient).not.toBeNull();
  });

});
