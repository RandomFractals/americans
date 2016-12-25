'use strict';

/**
 * Defines US state info for state census data lookups.
 */
class State {

  /**
  * Creates new State class instance.
  *
  * @param code State code/abbreviation, i.e. IL.
  * @param name State name.
  */
  constructor(code, name) {
    // save state info
    this._code = code;
    this._name = name;
  }


  /**
   * Gets state code.
   */
  get code() {
    return this._code;
  }


  /**
   * Gets state name.
   */
  get name() {
    return this._name;    
  }


  /**
   * @return Returns state name string.
   */
  toString() {
    return `${this.name}`;
  }

} 

exports["default"] = State;
module.exports = exports["default"];
