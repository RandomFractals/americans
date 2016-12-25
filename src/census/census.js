'use strict';

// import US counties data
const counties = require('./resources/us-counties.json');

// import County data model
const County = require('./county.js');

/**
 * Defines top-level Census data service api for getting US pop,
 * biz, trade, incomes, and housing data stats.  
 */
class Census {

  /**
  * Creates new Census data service instance.
  *
  * @param config Census data service config.
  */
  constructor(config) {
    // save config
    this._config = config;

    // load counties
    const countyMap = {};
    Object.keys(counties).forEach( code => {
      let countyData = counties[code];
      let county = new County(code, countyData.name, countyData.state);
      countyMap[county.key] = county;
    });
    this._counties = countyMap;
    console.log(`Census(): loaded ${Object.keys(this._counties).length} US counties`);
  }


  /**
   * Gets Census data service config.
   */
  get config() {
    return this._config;
  }


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
