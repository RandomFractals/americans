jest.dontMock('../../src/clients/messenger.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Messenger interface instance
const Messenger = require('../../src/clients/messenger.js');
const messenger = new Messenger(config);
const testUserId = '1165704360144557';

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

  it('fails on missing message text', () => {
    expect( () => {
      messenger.processMessage({
        sender: {}, recipient: {}, message: {}
      });
    }).toThrowError('Missing message text.');
  });

  xit('can process tests/message.json', () => {
    // load test message
    let messageData = null;    
    require('fs').readFile('./message.json', 'utf8', function(err, data) {      
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

  xit('can send a "test message"', () => {
    const testMessage = 'test message';
    return messenger.sendMessage(testUserId, testMessage)
      .then( (response) => {
        console.log(`send test message response: ${JSON.stringify(response)}`);
        expect(response.message).toEqual(testMessage); 
      });
  });    

  xit('What is the population of USA?', () => {
    return messenger.processMessage({
      sender: {id: testUserId}, 
      recipient: {id: 'PAGE_ID'}, 
      message: {text: 'What is the population of USA?'}
    })
    .then( (response) => {
      console.log(`population test response:  ${JSON.stringify(response)}`);
      expect(response).not.toBeNull(); 
    });
  });    

});