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
    this._code = code;
    this._name = name;
  }


  /**
   * Gets region code.
   */
  get code() {
    return this._code;
  }


  /**
   * Gets region name.
   */
  get name() {
    return this._name;    
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
