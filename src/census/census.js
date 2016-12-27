'use strict';

// import LocationService for location query validation
const LocationService = require('./location-service.js');

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
    // save config
    this.config = config;

    // create location service for open text location queries validation
    this.locationService = new LocationService();

    console.log(`Census(): created Census data service instance`);
  }
  

  /*---------------------- Census Data Service API Methods ----------------------------*/

  /**
   * Gets US population stats.
   * 
   * @param location US location: state, county, zip or USA (default).
   */
  getPopulation(location) {
    console.log(`Census:getPopulation(): location=${location}`);
    // TODO
  }

} // end of Census class

//export {Census as default}
// use old school for jest.js
exports["default"] = Census;
module.exports = exports["default"];
