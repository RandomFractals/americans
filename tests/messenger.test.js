jest.dontMock('../messenger.js');

const messenger = require('../messenger.js');

describe('Messenger Tests', () => {

  it('verifyRequestSignature() exists', () => {
    expect(messenger.verifyRequestSignature).not.toBeNull();
  });

  it('processMessage() exists', () => {
    expect(messenger.processMessage).not.toBeNull();
  });

  xit('processMessage() test', () => {
    let response = messenger.processMessage('test', 'hello', {});
    expect(response).toBe(undefined); // no return, so undefined
  });

  xit('Hi message test', () => {
    let payload = null;
    require('fs').readFile('tests/message.json', 'utf8', function(err, data) {
      if (err) throw err; // ignore this error handling for now
      payload = JSON.parse(data);
      expect(payload).not.toBeNull();

      // TODO:
      //let response = messenger.getFirstMessage(payload);
      //expect(response.message.text).toBe('Hi');
    });
  });

});