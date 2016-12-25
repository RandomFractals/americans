jest.dontMock('../../src/census/county.js');

// import state model class
const State = require('../../src/census/state.js');

// create state test data
const state = {
  code: 'IL',
  name: 'Illinois'
};

// create test state instance
const testState = new State(state.code, state.name);

// test state data model interface
describe('State Data Model Tests', () => {

  it('state code set/get test', () => {
    expect(testState.code).toEqual(state.code);
  });

  it('state name set/get test', () => {
    expect(testState.name).toEqual(state.name);
  });
  
  it('state toString() test', () => {
    expect(testState.toString()).toEqual(state.name);
  });
  
});

