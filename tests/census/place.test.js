jest.dontMock('../../src/census/place.js');

// import place model class
const Place = require('../../src/census/place.js');

// create city test data
const city = {
  code: '14000',
  name: 'Chicago city',
  state: 'IL',
  stateCode: '17',
  county: 'Cook County, DuPage County'
};

// create test city instance
const testCity = new Place(city.code, city.name, city.state, city.county);

// test place data model interface
describe('Place Data Model Tests', () => {

  it('place code set/get test', () => {
    expect(testCity.code).toEqual(city.code);
  });

  it('place name set/get test', () => {
    expect(testCity.name).toEqual(city.name);
  });

  it('place state set/get test', () => {
    expect(testCity.state).toEqual(city.state);
  });

  it('place county set/get test', () => {
    expect(testCity.county).toEqual(city.county);
  });
  
  it('place toString() test', () => {
    expect(testCity.toString()).toEqual(`${city.name}, ${city.state}`);
  });

  it('Chicago city key test', () => {
    expect(testCity.key).toEqual('chicago,il');
  });
  
});

