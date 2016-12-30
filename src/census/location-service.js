'use strict';

// load US states, zip codes, and counties FIPS data config
const states = require('./resources/us-states.json');
// TODO: const zipCodes = require('./resources/us-zip-codes.json');
const counties = require('./resources/us-counties.json');

// import State, ZipCode, and County model classes
const State = require('./state.js');
const ZipCode = require('./zip-code.js');
const County = require('./county.js');

/**
 * Defines location service api for validating 
 * US state, county, and zip code location queries.
 */
class LocationService {

  /**
  * Creates new LocationService service instance.
  *
  * Loads US states, zip codes, and counties FIPS config data.
  */
  constructor() {
    // load states config data
    this._stateMap = new Map();
    this._stateNameMap = new Map();
    Object.keys(states).forEach( code => {
      let stateData = states[code];
      let state = new State(code, stateData.name, stateData.key);
      this._stateMap.set(state.key.toLowerCase(), state);
      this._stateNameMap.set(state.lowerCaseKey, state);
    });

    // TODO: load valid zip codes from ZCTA (ZIP Code Tabulation Areas) config data

    // load counties FIPS config data
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

    console.log(`LocationService(): loaded ${this.states.size} states and ${this.counties.size} US counties`);

  } // end of constructor()


  /*-------------------- Location Service Data Config Methods -----------------------*/

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


  /*----------------- Location Service Region Validation Methods ---------------------*/

  /**
   * Checks if given region name is a valid state, county, or zip code.
   * 
   * @param regionName State name or code, zip code, or county name.
   */
  isValidRegion(regionName) {
    // use isValidState/ZipCode/County to check if given US geography exists
    return ( this.isValidState(regionName) ||
      this.isValidZipCode(regionName) ||
      this.isValidCounty(regionName) );
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
    if (zipCode === null || zipCode === undefined ||
      zipCode.length < 5 || isNaN(zipCode)) {
      return false; // not a valid zip code
    }
    
    // TODO: check against valid zip codes from ZCTA (ZIP Code Tabulation Areas) config data
    return true; // for now
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
    let countyStateKey = this.getCountyStateKey(countyKey);
    //console.log(`${countyKey} -> ${countyStateKey}`);
    return ( this.counties.has(countyKey) || 
      this.counties.has(countyStateKey) ||
      this.countyMapList.has(countyKey) ); 
  } 


  /**
   * Gets county,state.code key for [county],[state.name] strings.
   * 
   * @param countyStateString county,state.name key string, i.e. cook,illinois.
   * 
   * @return county,state.code key, i.e. cook,il.
   */
  getCountyStateKey(countyStateString) {
    // check for full state name suffix
    const countyTokens = countyStateString.split(',');
    if ( countyTokens.length > 1) {
      const countyKey = countyTokens[0];
      const stateName = countyTokens[countyTokens.length-1];
      //console.log(JSON.stringify(countyTokens));
      if ( this.stateNameMap.has(stateName) ) {
        const state = this.stateNameMap.get(stateName);        
        return `${countyKey},${state.key.toLowerCase()}`;
      }
    }
    return countyStateString;
  }


  /*----------------- Location Service Region Lookup Methods ---------------------*/

  /**
   * Gets region info the specified location string.
   * 
   * @param Location Location string.
   */
  getRegion(location) {
    let region = null;
    let regionKey = location.toLowerCase().split(' ').join('');
    if ( this.states.has(regionKey) ) {
      return this.states.get(regionKey);
    } else if ( this.stateNameMap.has(regionKey) ) {
      return this.stateNameMap.get(regionKey);
    /*} else if ( this.isValidZipCode(regionKey) ) {
      // create and return numeric zip code for now
      // without checks against ZCTA config data
      return new ZipCode(regionKey);*/
    } else {
      // check counties
      regionKey = regionKey.replace('county', '');
      let countyStateKey = this.getCountyStateKey(regionKey);
      if ( this.counties.has(regionKey) ) {
        return this.counties.get(regionKey);
      } else if ( this.counties.has(countyStateKey) ) {
        return this.counties.get(countyStateKey);
      } else if ( this.countyMapList.has(regionKey) ) {
        // return a list of matching counties
        return this.countyMapList.get(regionKey);
      } 
    }
    return region;
  }


} // end of LocationService class


//export {LocationService as default}
// use old school for jest.js
exports["default"] = LocationService;
module.exports = exports["default"];
