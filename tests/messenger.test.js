jest.dontMock('../messenger.js');

const messenger = require('../messenger.js');

describe('Messenger Interface Tests', () => {

  it('verifyRequestSignature() exists', () => {
    expect(messenger.verifyRequestSignature).not.toBeNull();
  });

  it('processMessage() exists', () => {
    expect(messenger.processMessage).not.toBeNull();
  });

  it('sendMessage() exists', () => {
    expect(messenger.sendMessage).not.toBeNull();
  });
});

describe('Messenger processMessage() Tests', () => {

  it('fails on processing empty message', () => {
    expect( () => {
      messenger.processMessage({
        sender: {}, recipient: {}, message: {}
      });
    }).toThrowError('Missing message request content.');
  });

  it('can process tests/message.json', () => {
    // load test message
    let messageData = null;    
    require('fs').readFile('tests/message.json', 'utf8', function(err, data) {      
      if (err) throw err; // ignore this error handling for now
      messageData = JSON.parse(data);

      // process test message
      return messenger.processMessage(messageData.entry[0].messaging[0])
        .then( (response) => {
          expect(response).toBe(undefined); // no return, so undefined 
        });
    });
  });

  xit('What is the population of USA?', () => {
    // TODO
    expect( () => {
      messenger.processMessage({
        sender: {id: '1165704360144557'}, 
        recipient: {id: 'PAGE_ID'}, 
        message: {text: 'What is the population of USA?'}
      })
    }).toBeDefined(); 
  });    

});