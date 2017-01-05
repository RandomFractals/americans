// load config
const config = require('../../src/utils/app-config.js');

// create Slack chat client interface instance
const Telegram = require('../../src/clients/telegram.js');
const telegram = new Telegram(config);
const testUserId = '#americans';

describe('Telegram Interface Tests', () => {

  it('processMessage() exists', () => {
    expect(telegram.processMessage).not.toBeNull();
  });

  it('sendMessage() exists', () => {
    expect(telegram.sendMessage).not.toBeNull();
  });
});

describe('Telegram processMessage() Tests', () => {

  it('fails on missing message text', () => {
    expect( () => {
      telegram.processMessage({
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
      return telegram.processMessage(messageData.entry[0].messaging[0])
        .then( (response) => {
          expect(response).toBe(undefined); // no return, so undefined 
        });
    });
  });

  xit('can send a "test message"', () => {
    const testMessage = 'test message';
    return telegram.sendMessage(testUserId, testMessage)
      .then( (response) => {
        console.log(`send test message response: ${JSON.stringify(response)}`);
        expect(response.message).toEqual(testMessage); 
      });
  });    

  xit('usa pop?', () => {
    return telegram.processMessage({
      sender: {id: testUserId}, 
      recipient: {id: testUserId}, 
      message: {text: 'usa pop?'}
    })
    .then( (response) => {
      console.log(`Telegram.test: pop test msg response:  ${JSON.stringify(response)}`);
      expect(response).not.toBeNull(); 
    });
  });    

  it('chicago,il pop?', () => {
    return telegram.processMessage({
      sender: {id: testUserId}, 
      recipient: {id: testUserId}, 
      message: {text: 'chicago,il pop?'}
    })
    .then( (response) => {
      console.log(`Telegram.test: pop test msg response:  ${JSON.stringify(response)}`);
      expect(response).not.toBeNull(); 
    });
  });    
  

});