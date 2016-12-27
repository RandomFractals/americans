'use strict';

const Region = require('./region.js');

/**
 * Defines US ZipCode data model for ZCTA 
 * (ZIP Code Tabulation Areas) config data loading.
 * 
 * @see 
 */
class ZipCode extends Region {

  /**
  * Creates new ZipCode class instance.

  * @param code Zip code string.
  */
  constructor(code) {
    super(code, code);
  }

} 

exports["default"] = ZipCode;
module.exports = exports["default"];
