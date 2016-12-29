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

  it('getPopulation(location="usa") > 0', () => {
    return census.getPopulation('usa')
      .then( (response) => {
        console.log(`getPopulation() response: ${JSON.stringify(response)}`);
        expect(Number(response.population)).toBeGreaterThan(0);
        expect(Number(response.density)).toBeGreaterThan(0);
        expect(response.location).toBe('USA');
      });
  });

  it('getPopulation(location="IL") > 0', () => {
    return census.getPopulation('IL')
      .then( (response) => {
        console.log(`getPopulation() response: ${JSON.stringify(response)}`);
        expect(Number(response.population)).toBeGreaterThan(0);
        expect(Number(response.density)).toBeGreaterThan(0);
        expect(response.location).toBe('Illinois');
      });
  });

  it('getPopulation(location="Cook county, illinois") > 0', () => {
    return census.getPopulation('Cook county, illinois')
      .then( (response) => {
        console.log(`getPopulation() response: ${JSON.stringify(response)}`);
        expect(Number(response.population)).toBeGreaterThan(0);
        expect(Number(response.density)).toBeGreaterThan(0);
        expect(response.location).toBe('Cook County, Illinois');
      });
  });
});