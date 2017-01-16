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
  * @param code 2 digit state code.
  * @param name State name.
  * @param key State key/abbreviation, i.e. IL
  */
  constructor(code, name, key) {
    super(code, name);
    this.key = key;
    this.type = 'state';
  }

} 

module.exports = State;
