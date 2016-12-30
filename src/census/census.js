'use strict';

const fetch = require('node-fetch');
const Region = require('./region.js');

// import LocationService for location query validation
const LocationService = require('./location-service.js');

// import census data services config
const servicesConfig = require('./resources/services-config.json');


/**
 * Defines top-level Census data service api for getting US pop,
 * biz, trade, incomes, and housing data stats.  
 */
class Census {

  /**
  * Creates new Census data service instance.
  *
  * Loads US states, zip codes, and counties FIPS data config.
  *
  * @param config Census data service config.
  */
  constructor(config) {
    // save app config
    this.config = config;

    // load census data services config
    this.services = new Map();
    Object.keys(servicesConfig).forEach( serviceName => {
      this.services.set(serviceName, servicesConfig[serviceName]);
    });

    // create location service for open text location queries validation
    this.locationService = new LocationService();

    console.log('Census(): Census data service instance created');
  }


  /*---------------------- Census Data Service API Methods ----------------------------*/

  /**
   * Gets US population stats from census.gov.
   * 
   * @param location US location: state, county, zip or USA (default).
   * 
   * @see http://api.census.gov/data/2015/pep/population.html
   * @see http://api.census.gov/data/2015/pep/population/examples.html
   */
  getPopulation(location='us', year='2015') {
    console.log(`Census:getPopulation():location=${location}, year=${year}`);

    // get population data service config
    const popService = this.services.get('population');
    //console.log('Census.getPopulation(): service config:\n', JSON.stringify(popService));

    // get valid region info
    let region = this.locationService.getRegion(location);
    if ( region === null) {
      // defualt to USA
      region = new Region('1', 'USA');
    }

    // create for and in query params
    let forQueryParam = region.code;
    let inQueryParam = '';
    if (region.type === 'county') {
      // qualify county query with state code param
      let state = this.locationService.getRegion(region.state.toLowerCase());
      inQueryParam = `&in=state:${state.code}`;
      // strip out state code
      forQueryParam = String(region.code).substring(2);
    }
    console.log(`Census:getPopulation():query: for=${region.type}:${forQueryParam}${inQueryParam}`);

    // get region pop data
    return fetch(`${popService.host}/${year}/${popService.url}` +
      `?get=${popService.get}&for=${region.type}:${forQueryParam}${inQueryParam}` +
      `&key=${this.config.CENSUS_DATA_API_KEY}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(`Census.getPopulation(): response:${JSON.stringify(jsonResponse)}`);
      // extract population data
      const popData = jsonResponse[1]; // skip header data row
      return { 
        population: popData[0],
        density: popData[1],
        location: region.toString()};
    });
  } // end of getPopulation()

} // end of Census class

//export {Census as default}
// use old school for jest.js
exports["default"] = Census;
module.exports = exports["default"];
