'use strict';

const Region = require('./region.js');

/**
 * Defines US state info for state census data lookups.
 */
class State extends Region {

  /**
  * Creates new State class instance
  * with state code and name to display.
  *
  * @param code State code/abbreviation, i.e. IL.
  * @param name State name.
  */
  constructor(code, name) {
    super(code, name);
  }

} 

exports["default"] = State;
module.exports = exports["default"];
