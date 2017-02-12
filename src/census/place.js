'use strict';

const Region = require('./region.js');

/**
 * Defines US city, town, or village place with 5 digit FIPS code,
 * state and county for place census data lookups.
 * 
 * @see https://www.census.gov/geo/reference/codes/place.html
 */
class Place extends Region {

  /**
  * Creates new Place class instance.
  *
  * @param code Place 5 digit FIPS code.
  * @param name Place name.
  * @param state Place state code.
  * @param county Place county name.
  *
  * @see https://www.census.gov/geo/reference/codes/place.html
  */
  constructor(code, name, state, county) {
    super(code, name);
    this.state = state;
    this.county = county;
    this.type = 'place';

    // create place key for lookups
    this.key = `${this.shortNameKey}${this.state.toLowerCase()}`;
  }


  /**
   * Creates new Place instance from place text line config.
   * 
   * @param placeTextLine Place config text line of form: 
   * 
   * IL|17|34722|Highland Park city|Incorporated Place|A|Lake County
   * 
   * @return valid Place instance.
   */
  static create(placeTextLine) {
    let place = null;
    let placeTokens = placeTextLine.trim().split('|');
    if (placeTokens.length == 7) {
      // create new place info
      place = new Place(
        placeTokens[2], // code
        placeTokens[3], // name
        placeTokens[0], // state
        placeTokens[6] // county
      );
    }

    return place;
  }


  /**
   * Gets short place name key, without state,
   * city, town, village or CDP suffix
   * for places lookup without state code.
   */
  get shortNameKey() {
    // strip out ' city', ' town', ' village', and ' CDP',
    // lowercase, strip out spaces, and append state code
    return this.name.replace(' city', '')
      .replace(' town', '')
      .replace(' village', '')
      .replace(' CDP', '') // CDP - Census Designated Place
      .toLowerCase().split(' ').join(''); // strip out spaces
  }


  /**
   * @return Returns place name with state abbreviation.
   */
  toString() {
    return `${this.name}, ${this.state}`;
  }

} 

module.exports = Place;
