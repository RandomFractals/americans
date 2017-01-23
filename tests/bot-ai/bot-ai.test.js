jest.dontMock('../../src/bot-ai/bot-ai.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Messenger chat client for tests
const Messenger = require('../../src/clients/messenger.js');
const messenger = new Messenger(config);

// create bot ai instance
const BotAI = require('../../src/bot-ai/bot-ai.js');
const botAI = new BotAI(config, messenger);

describe('Bot AI Interface Tests', () => {

  it('processMessage() is defined', () => {
    expect(botAI.processMessage).toBeDefined();
  });
});

describe('Bot AI processMessage() Tests', () => {

  it('fails on missing message text', () => {
    expect( () => {
      botAI.processMessage({
        sender: {}, recipient: {}, message: {}
      });
    }).toThrowError('Missing message text.');
  });

  it('What is the population of Chicago, IL?', () => {
    return botAI.processMessage({
        sender: {id: "1165704360144557"}, 
        recipient: {id: "PAGE_ID"}, 
        message: {text: "What is the population of Chicago, IL?"}
    }).then( (context) => { 
      // check if location was added to chat session context
      expect(context.location).toEqual('Chicago city, IL');
    });
  });    

});