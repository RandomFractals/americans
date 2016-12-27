jest.dontMock('../../src/census/census.js');

// load config
const config = require('../../src/utils/app-config.js');

// create Census data service interface instance
const Census = require('../../src/census/census.js');
const census = new Census(config);

describe('Census Data Service Interface Tests', () => {
  // TODO
  it('has getPopulation(location) defined', () => {
    expect(census.getPopulation).toBeDefined();
  });

});