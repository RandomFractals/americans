'use strict';

// load US states, zip codes, and counties FIPS data config
const states = require('./resources/us-states.json');
// TODO: const zipCodes = require('./resources/us-zip-codes.json');
const counties = require('./resources/us-counties.json');

// import State, ZipCode, and County model classes
const State = require('./state.js');
// TODO: const ZipCode = require('./zip-code.js');
const County = require('./county.js');

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
    this._config = config;

    // load states FIPS data
    this._stateMap = new Map();
    this._stateNameMap = new Map();
    Object.keys(states).forEach( code => {
      let state = new State(code, states[code]);
      this._stateMap.set(code.toLowerCase(), state);
      this._stateNameMap.set(state.lowerCaseKey, state);
    });

    // TODO: load valid zip codes from ZCTA (ZIP Code Tabulation Areas) config data

    // load counties FIPS data
    this._countyMap = new Map();
    this._countyMapList = new Map();
    Object.keys(counties).forEach( code => {
      let countyData = counties[code];
      let county = new County(code, countyData.name, countyData.state);
      this._countyMap.set(county.key, county);
      if ( !this._countyMapList.has(county.shortNameKey) ) {
        this._countyMapList.set(county.shortNameKey, []);
      }
      let countyList = this._countyMapList.get(county.shortNameKey);
      countyList.push(county);
    });

    console.log(`Census(): loaded ${this.states.size} states and ${this.counties.size} US counties`);

  } // end of constructor()


  /*-------------------- Census Data Service Config Methods ---------------------------*/

  /**
   * Gets Census data service config.
   */
  get config() {
    return this._config;
  }


  /**
   * Gets loaded states map.
   */
  get states() {
    return this._stateMap;
  }


  /**
   * Gets state name map.
   */
  get stateNameMap() {
    return this._stateNameMap;
  }


  /**
   * Gets loaded counties map.
   */
  get counties() {
    return this._countyMap;
  }


  /**
   * Gets county map list for county lookups without state code.
   */
  get countyMapList() {
    return this._countyMapList;
  }


  /*----------------- Census Data Service Region Validation Methods -------------------*/

  /**
   * Checks if given region name is a valid state, county, or zip code.
   * 
   * @param regionName State name or code, zip code, or county name.
   */
  isValidRegion(regionName) {
    // TODO: use isValidState/ZipCode/County to check if given US geography exists
  }


  /**
   * Checks if given state exists.
   * 
   * @param stateName State name or code.
   */
  isValidState(stateName) {
    if (stateName === null || stateName === undefined) {
      return false;
    }

    // gen. lower case state key without white spaces
    const stateKey = stateName.toLowerCase().split(' ').join('');
    return ( this.states.has(stateKey) || this.stateNameMap.has(stateKey) );
  }


  /**
   * Checks if given zip code exitss.
   * 
   * @param zipCode 5 digit zip code.
   */
  isValidZipCode(zipCode) {
    // TODO: check against valid zip codes from ZCTA (ZIP Code Tabulation Areas) config data
  }


  /**
   * Checks if given county exists.
   * 
   * @param countyName County name string, with or without state name or code suffix.
   */
  isValidCounty(countyName) {
    if (countyName === null || countyName === undefined) {
      return false;
    }

    // gen. lower case county key without white spaces and 'county' suffix
    let countyKey = countyName.toLowerCase().split(' ').join('').replace('county', '');
    if ( this.counties.has(countyKey) || this.countyMapList.has(countyKey) ) {
      return true; // matches loaded countie(s) name or county with state abbreviation
    }

    // check for full state name suffix at last
    const countyTokens = countyKey.split(',');
    if ( countyTokens.length > 1) {
      countyKey = countyTokens[0];
      const stateName = countyTokens[countyTokens.length-1];
      const state = this.stateNameMap.get(stateName);
      //console.log(JSON.stringify(countyTokens));
      //console.log(state.toString());
      if (state !== null && //this.stateNameMap.has(stateName) && 
        this.counties.has(`${countyKey},${state.code.toLowerCase()}`)) {
          return true;
      }
    }

    return false; // not a valid county name string

  } // end of isValidCounty(countyString)


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
