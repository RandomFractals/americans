jest.dontMock('../../src/census/county.js');

// import county model class
const County = require('../../src/census/county.js');

// create county test data
const county = {
  code: '17031',
  name: 'Cook County',
  state: 'IL'
};

// create test county instance
const testCounty = new County(county.code, county.name, county.state);

// test county data model interface
describe('County Data Model Tests', () => {

  it('county code set/get test', () => {
    expect(testCounty.code).toEqual(county.code);
  });

  it('county name set/get test', () => {
    expect(testCounty.name).toEqual(county.name);
  });

  it('county state set/get test', () => {
    expect(testCounty.state).toEqual(county.state);
  });
  
  it('county toString() test', () => {
    expect(testCounty.toString()).toEqual(`${county.name}, ${county.state}`);
  });

  it('county key test', () => {
    expect(testCounty.key).toEqual('cook,il');
  });

  it('county short name key test', () => {
    expect(testCounty.shortNameKey).toEqual('cook');
  });
  
});

