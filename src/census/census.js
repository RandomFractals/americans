'use strict';

// load US states and counties data
const states = require('./resources/us-states.json');
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

    // set states
    this._states = states;

    // load counties
    const countyMap = {};
    const countyMapList = {};
    Object.keys(counties).forEach( code => {
      let countyData = counties[code];
      let county = new County(code, countyData.name, countyData.state);
      countyMap[county.key] = county;
      // update matching county without state code map list
      let countyList = countyMap[county.shortNameKey];
      if (countyList === null || countyList === undefined) {
        countyList = [];
        countyMapList[county.shortNameKey] = countyList;
      }
      countyList.push(county);
    });

    this._counties = countyMap;
    this._countyMapList = countyMapList;

    console.log(`Census(): loaded ${this.states.length} states and ${this.counties.length} US counties`);

  } // end of constructor()


  /**
   * Gets Census data service config.
   */
  get config() {
    return this._config;
  }


  /**
   * Gets states list.
   */
  get states() {
    return Object.values(this._states);
  }


  /**
   * Gets a list of loaded counties.
   */
  get counties() {
    return Object.values(this._counties);
  }


  /**
   * Gets county map list for county lookups without state code.
   */
  get countyMapList() {
    return this._countyMapList;
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
