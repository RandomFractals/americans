jest.dontMock('../../src/census/census.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Census data service interface instance
const Census = require('../../src/census/census.js');
const census = new Census(config);

describe('Census Data Service Interface Tests', () => {

  it('has loaded 50+ US states FIPS config data', () => {
    expect(census.states.size).toBeGreaterThanOrEqual(50);
  });

  it('has loaded IL state info', () => {
    expect(census.states.get('IL').toString()).toEqual('Illinois');
  });

  it('has Illinois state info', () => {
    expect(census.stateNameMap.get('Illinois').toString()).toEqual('Illinois');
  });

  it('IL is a valid state', () => {
    expect(census.isValidState('IL')).toEqual(true);
  });

  it('Illinois is a valid state', () => {
    expect(census.isValidState('Illinois')).toEqual(true);
  });

  it('BR is NOT a valid state!', () => {
    expect(census.isValidState('BR')).toEqual(false);
  });

  it('Brr! is NOT a valid state!', () => {
    expect(census.isValidState('Brr!')).toEqual(false);
  });

  it('Illinoise is NOT a valid state! :)', () => {
    expect(census.isValidState('Illinoise')).toEqual(false);
  });

  it('has loaded 3000+ US counties FIPS config data', () => {
    expect(census.counties.size).toBeGreaterThan(3000);
  });

  it('has loaded Cook County info', () => {
    expect(census.counties.get('cook,IL').toString()).toEqual('Cook County, IL');
  });

  it('has some matching county names across all states', () => {
    expect(census.countyMapList.size).toBeLessThan(census.counties.size);
  });

  it('has more than 1 Lake County across all states', () => {
    expect(census.countyMapList.get('lake').length).toBeGreaterThan(1);
  });

  it('has getPopulation(location) defined', () => {
    expect(census.getPopulation).toBeDefined();
  });
});

