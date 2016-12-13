jest.dontMock('../../src/bot-ai/bot-ai-factory.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Messenger interface instance
const Messenger = require('../../src/clients/messenger.js');
const messenger = new Messenger(config);

const BotAIFactory = require('../../src/bot-ai/bot-ai-factory.js');

describe('Bot AI Factory Interface Tests', () => {

  const botAIFactory = new BotAIFactory(config, messenger); // chat client
  it('can create bot AI engine for the given chat client', () => {
    expect(botAIFactory.botAI).not.toBeNull();
  });

  it('has a chat client associated with it', () => {
    expect(botAIFactory.chatClient).not.toBeNull();
  });

});
