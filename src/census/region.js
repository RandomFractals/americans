'use strict';

/**
 * Defines US region base class.
 */
class Region {

  /**
  * Creates new Region class instance
  * with region code and name.
  *
  * @param code Region code.
  * @param name Region name.
  */
  constructor(code, name) {
    this.code = code;
    this.name = name;
    this.type = 'us'; // default to us
  }


  /**
   * Generates lower case region name key
   * without white spaces for hashing and lookups.
   */
  get lowerCaseKey() {
    return this.name.toLowerCase().split(' ').join('');
  }


  /**
   * @return Returns region name string for display.
   */
  toString() {
    return `${this.name}`;
  }

} 

exports["default"] = Region;
module.exports = exports["default"];
