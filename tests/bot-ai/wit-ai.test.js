jest.dontMock('../../src/bot-ai/wit-ai.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Messenger chat client for tests
const Messenger = require('../../src/clients/messenger.js');
const messenger = new Messenger(config);

// create wit.ai bot instance
const WitAI = require('../../src/bot-ai/wit-ai.js');
const witAI = new WitAI(config, messenger);

describe('Bot AI Interface Tests', () => {

  it('processMessage() is defined', () => {
    expect(witAI.processMessage).toBeDefined();
  });
});

describe('Bot AI processMessage() Tests', () => {

  it('fails on missing message text', () => {
    expect( () => {
      witAI.processMessage({
        sender: {}, recipient: {}, message: {}
      });
    }).toThrowError('Missing message text.');
  });

  it('What is the population of Chicago, IL?', () => {
    return witAI.processMessage({
        sender: {id: "1165704360144557"}, 
        recipient: {id: "PAGE_ID"}, 
        message: {text: "What is the population of Chicago, IL?"}
    }).then( (context) => { 
      expect(context).toEqual('Hi');
    });

    /*return expect( () => {
      witAI.processMessage({
        sender: {id: "1165704360144557"}, 
        recipient: {id: "PAGE_ID"}, 
        message: {text: "What is the population of USA?"}
      });
    }).toBe('Hi'); //.toBeDefined(); // TODO: should return current USA pop text response
    */
  });    

});