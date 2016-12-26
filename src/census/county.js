'use strict';

const Region = require('./region.js');

/**
 * Defines US county with 5 digit FIPS code,
 * county name and state for county census data lookups.
 */
class County extends Region {

  /**
  * Creates new County class instance.
  *
  * @param code 5 digit FIPS code.
  * @param name County name.
  * @param state County state code.
  *
  * @see https://en.wikipedia.org/wiki/FIPS_county_code
  */
  constructor(code, name, state) {
    //this._code = code;
    //this._name = name;
    super(code, name);
    this._state = state;
  }


  /**
   * Gets short county name key, without state,
   * for counties lookup without state code.
   */
  get shortNameKey() {
    return this.name.toLowerCase().replace(' ', '').replace('county', '');
  }


  /**
   * Gets county key with state code
   * for lookups and county query validation.
   * 
   * Example: 'Cook County, IL' => 'cook,IL'
   */
  get key() {
    return `${this.shortNameKey},${this.state}`;
  }


  /**
   * Gets county state abbreviation.
   */
  get state() {
    return this._state;
  }


  /**
   * @return Returns county name and state abbreviation.
   */
  toString() {
    return `${this.name}, ${this.state}`;
  }

} 

exports["default"] = County;
module.exports = exports["default"];
