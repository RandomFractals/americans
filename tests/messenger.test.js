jest.dontMock('../messenger.js');

const messenger = require('../messenger.js');

describe('Messenger tests', () => {

  it('verifyRequestSignature exists', () => {
    expect(messenger.verifyRequestSignature).not.toBeNull();
  });

});