jest.dontMock('../../src/census/census.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Census data service interface instance
const Census = require('../../src/census/census.js');
const census = new Census(config);

describe('Census Data Service Interface Tests', () => {

  it('has loaded US states FIPS config data', () => {
    expect(census.states.length).toBeGreaterThanOrEqual(50);
  });

  it('has loaded US counties FIPS config data', () => {
    expect(census.counties.length).toBeGreaterThan(3000);
  });

  it('has some matching county names across all states', () => {
    expect(Object.values(census.countyMapList).length).toBeLessThan(census.counties.length);
  });

  it('has getPopulation(location) defined', () => {
    expect(census.getPopulation).toBeDefined();
  });
});

