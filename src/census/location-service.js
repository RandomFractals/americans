'use strict';

// import fs and readline for laoding us-places.txt config
const fs = require('fs');
const readLine = require('readline');

// import numeral for memory usage logging
const numeral = require('numeral');

// load US states, zip codes, and counties FIPS data config
const states = require('./resources/us-states.json');
// TODO: const zipCodes = require('./resources/us-zip-codes.json');
const counties = require('./resources/us-counties.json');

// import state, county, place model classes
const State = require('./state.js');
const County = require('./county.js');
const Place = require('./place.js');
const ZipCode = require('./zip-code.js');

/**
 * Defines location service api for validating 
 * USA state, county, place, and zip code location queries.
 */
class LocationService {

  /**
  * Creates new LocationService service instance.
  *
  * Loads USA states, counties, and places FIPS config data.
  */
  constructor() {
    // load USA states config data
    this.states = LocationService.getStates();
    this.stateNameMap = LocationService.getStateNameMap();

    // TODO: load valid zip codes from ZCTA (ZIP Code Tabulation Areas) config data

    // load USA counties FIPS config data
    this.counties = LocationService.getCounties();
    this.countyMapList = LocationService.getCountyMapList();

    // load USA places: cities, towns, villages, etc.
    this.places = LocationService.getPlaces();

    console.log('LocationService(): LocationService instance created!');
  }


  /*-------------------- Location Service Data Load/Config Methods -----------------------*/

  /**
   * Gets loaded USA states data from ./resources/us-states.json config.
   */
  static getStates() {

    if (LocationService.stateMap !== null && LocationService.stateMap !== undefined) {
      return LocationService.stateMap;
    }

    console.log(`LocationService.getStates(): loading USA states config...`);
    
    // load states config data
    LocationService.stateMap = new Map();
    LocationService.stateNameMap = new Map();
    Object.keys(states).forEach( code => {
      let stateData = states[code];
      let state = new State(code, stateData.name, stateData.key);
      LocationService.stateMap.set(state.key.toLowerCase(), state);
      LocationService.stateNameMap.set(state.lowerCaseKey, state);
    });
    console.log(`LocationService.getStates(): loaded ${LocationService.stateMap.size} USA states`);
    
    return LocationService.stateMap;
  }


  /**
   * Gets loaded state name map.
   */
  static getStateNameMap() {
    if (LocationService.stateNameMap !== null && LocationService.stateNameMap !== undefined) {
      return LocationService.stateNameMap;
    }

    // load states data
    LocationService.getStates();
    return LocationService.stateNameMap;
  }


  /**
   * Gets loaded USA counties data from ./resources/us-counties.json config.
   */
  static getCounties() {

    if (LocationService.countyMap !== null && LocationService.countyMap !== undefined) {
      return LocationService.countyMap;
    }
    
    console.log(`LocationService.getCounties(): loading USA counties config...`);
    
    // load counties FIPS config data
    LocationService.countyMap = new Map();
    LocationService.countyMapList = new Map();
    Object.keys(counties).forEach( code => {
      let countyData = counties[code];
      let county = new County(code, countyData.name, countyData.state);
      LocationService.countyMap.set(county.key, county);
      if ( !LocationService.countyMapList.has(county.shortNameKey) ) {
        // create county name list for counties without state suffix lookups
        LocationService.countyMapList.set(county.shortNameKey, []);
      }
      let countyList = LocationService.countyMapList.get(county.shortNameKey);
      countyList.push(county);
    });

    console.log(`LocationService.getCounties(): loaded ${LocationService.countyMap.size} USA counties.`);

    return LocationService.countyMap;
  }


  /**
   * Gets county map list for county lookups without state code.
   */
  static getCountyMapList() {
    if (LocationService.countyMapList !== null && LocationService.countyMapList !== undefined) {
      return LocationService.countyMapList;
    }

    // load USA counties data
    LocationService.getCounties();
    return LocationService.countyMapList;
  }


  /**
   * Gets loaded USA places data from ./resources/us-places.txt config.
   */
  static getPlaces() {
    if (LocationService.placeMap !== null && LocationService.placeMap !== undefined) {
      return LocationService.placeMap;
    }
    
    console.log('LocationService.getPlaces(): loading USA places config...');
    LocationService.logMemoryUsage();

    // load USA places: cities, towns, villages, etc.
    let placesCount = 0;    
    LocationService.placeMap = new Map();
    const placesConfig = readLine.createInterface({
      input: fs.createReadStream('./src/census/resources/us-places.txt', {flags:'r', autoClose: true}),
      terminal: false
    });

    placesConfig.on('line', (line) => {
      // create place tokens from place text line
      // example: IL|17|34722|Highland Park city|Incorporated Place|A|Lake County      
      let placeTokens = line.trim().split('|');
      if (placeTokens.length == 7) {
        // create new place info
        let place = new Place(
          placeTokens[2], // code
          placeTokens[3], // name
          placeTokens[0], // state
          placeTokens[6] // county
        );
        // add to loaded places
        LocationService.placeMap.set(place.key, place);
        placesCount++;
      }
    });

    placesConfig.on('close', () => {
      console.log(`LocationService.getPlaces(): loaded ${LocationService.placeMap.size} USA places.`);
      LocationService.logMemoryUsage();
    });

    return LocationService.placeMap;
  }


  /**
   * Logs memory usage before and after USA places data load for heap size trace.
   */
  static logMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    console.log(`Heap: RSS=${numeral(memoryUsage.rss).format('0,0')}`,
      `heapTotal=${numeral(memoryUsage.heapTotal).format('0,0')}`,
      `heapUsed=${numeral(memoryUsage.heapUsed).format('0,0')}`);
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
    if (!location || location.length < 2) {
      return null; // invalid location string
    }

    // gen. lower case region key without white spaces
    let regionKey = location.toLowerCase().split(' ').join('');

    // check states
    if ( this.states.has(regionKey) ) {
      return this.states.get(regionKey);
    }     
    if ( this.stateNameMap.has(regionKey) ) {
      return this.stateNameMap.get(regionKey);
    }

    // check places
    let placeKey = location.replace(' city', '')
      .replace(' town', '')
      .replace(' village', '')
      .replace(' CDP', '') // CDP - Census Designated Place
      .toLowerCase()
      .split(' ').join('');
    if (this.places.has(placeKey)) {
      return this.places.get(placeKey);
    }

    // check counties
    let countyKey = regionKey.replace('county', '');
    let countyStateKey = this.getCountyStateKey(countyKey);
    if ( this.counties.has(countyKey) ) {
      return this.counties.get(countyKey);
    }    
    if ( this.counties.has(countyStateKey) ) {
      return this.counties.get(countyStateKey);
    }
    if ( this.countyMapList.has(countyKey) ) {
      // return a list of matching counties
      return this.countyMapList.get(countyKey);
    }

    // TODO: check zip codes
    /*if ( this.isValidZipCode(regionKey) ) {
      // create and return numeric zip code for now
      // without checks against ZCTA config data
        return new ZipCode(regionKey);
    }*/
    
    // no valid US region info found
    return null;

  } // end of getRegion(location)


} // end of LocationService class


//export {LocationService as default}
// use old school for jest.js
exports["default"] = LocationService;
module.exports = exports["default"];
