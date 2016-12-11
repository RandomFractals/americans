jest.dontMock('../src/bot-ai/bot-ai.js');

const botAI = require('../src/bot-ai/bot-ai.js');

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

  it('What is the population of USA?', () => {
    return expect( () => {
      botAI.processMessage({
        sender: {id: "1165704360144557"}, 
        recipient: {id: "PAGE_ID"}, 
        message: {text: "What is the population of USA?"}
      });
    }).toBeDefined(); // TODO: should return current USA pop text response
  });    

});