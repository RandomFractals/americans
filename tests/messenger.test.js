jest.dontMock('../src/clients/messenger.js');

// load config
const config = require('../src/utils/config.js');

// create Messenger interface instance
const Messenger = require('../src/clients/messenger.js');

describe('Messenger Interface Tests', () => {

  const messenger = new Messenger(config);
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

  it('fails on missing message text', () => {
    const config = require('../src/utils/config.js');
    const messenger = new Messenger(config);    
    expect( () => {
      messenger.processMessage({
        sender: {}, recipient: {}, message: {}
      });
    }).toThrowError('Missing message text.');
  });

  xit('can process tests/message.json', () => {
    // load test message
    let messageData = null;    
    require('fs').readFile('tests/message.json', 'utf8', function(err, data) {      
      if (err) throw err; // ignore this error handling for now
      messageData = JSON.parse(data);

      // process test message
      const messenger = new Messenger(config);
      return messenger.processMessage(messageData.entry[0].messaging[0])
        .then( (response) => {
          expect(response).toBe(undefined); // no return, so undefined 
        });
    });
  });

  it('can send a "test message"', () => {
    const config = require('../src/utils/config.js');
    const messenger = new Messenger(config);    
    return messenger.sendMessage('1165704360144557', 'test message')
      .then( (response) => {
        expect(response).not.toBeNull(); 
      });
  });    

  it('What is the population of USA?', () => {
    const config = require('../src/utils/config.js');
    const messenger = new Messenger(config);
    return messenger.processMessage({
      sender: {id: '1165704360144557'}, 
      recipient: {id: 'PAGE_ID'}, 
      message: {text: 'What is the population of USA?'}
    })
    .then( (response) => {
      expect(response).not.toBeNull(); 
    });
  });    

});