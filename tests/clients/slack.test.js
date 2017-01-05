jest.dontMock('../../src/clients/slack.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Slack chat client interface instance
const Slack = require('../../src/clients/slack.js');
const slack = new Slack(config);
const testUserId = '#americans';

describe('Slack Interface Tests', () => {

  it('processMessage() exists', () => {
    expect(slack.processMessage).not.toBeNull();
  });

  it('sendMessage() exists', () => {
    expect(slack.sendMessage).not.toBeNull();
  });
});

describe('Slack processMessage() Tests', () => {

  it('fails on missing message text', () => {
    expect( () => {
      slack.processMessage({
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
      return slack.processMessage(messageData.entry[0].messaging[0])
        .then( (response) => {
          expect(response).toBe(undefined); // no return, so undefined 
        });
    });
  });

  xit('can send a "test message"', () => {
    const testMessage = 'test message';
    return slack.sendMessage(testUserId, testMessage)
      .then( (response) => {
        console.log(`send test message response: ${JSON.stringify(response)}`);
        expect(response.message).toEqual(testMessage); 
      });
  });    

  xit('usa pop?', () => {
    return slack.processMessage({
      sender: {id: testUserId}, 
      recipient: {id: testUserId}, 
      message: {text: 'usa pop?'}
    })
    .then( (response) => {
      console.log(`Slack.test: pop test msg response:  ${JSON.stringify(response)}`);
      expect(response).not.toBeNull(); 
    });
  });    

  it('chicago,il pop?', () => {
    return slack.processMessage({
      sender: {id: testUserId}, 
      recipient: {id: testUserId}, 
      message: {text: 'chicago,il pop?'}
    })
    .then( (response) => {
      console.log(`Slack.test: pop test msg response:  ${JSON.stringify(response)}`);
      expect(response).not.toBeNull(); 
    });
  });    

});