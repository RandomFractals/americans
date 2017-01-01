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

    // create place key for lookups:
    // strip out ' city', ' town', ' village', and ' CDP',
    // lowercase, strip out spaces, and append state code
    this.key = this.name.replace(' city', '')
      .replace(' town', '')
      .replace(' village', '')
      .replace(' CDP', '') // CDP - Census Designated Place
      .toLowerCase()
      .split(' ').join('') + ',' + this.state.toLowerCase();
  }


  /**
   * @return Returns place name with state abbreviation.
   */
  toString() {
    return `${this.name}, ${this.state}`;
  }

} 

exports["default"] = Place;
module.exports = exports["default"];
