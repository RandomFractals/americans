jest.dontMock('../config.js');

describe('App Config Tests', () => {
  
  xit('No WIT_TOKEN test',  () => {
    const config = require('../config.js');
    expect(config.WIT_TOKEN).toThrow(new Error('missing WIT_TOKEN'));
  });

  it('WIT_TOKEN test', () => {
    process.env.WIT_TOKEN = 'wit_token';
    const config = require('../config.js');
    expect(config.WIT_TOKEN).toEqual('wit_token');
  });

  it('WIT_TOKEN set test', () => {
    const config = require('../config.js');
    expect(config.WIT_TOKEN).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('token>');
  });

  it('FB_PAGE_TOKEN set test', () => {
    const config = require('../config.js');
    expect(config.FB_PAGE_TOKEN).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('token>');    
  });


  it('FB_APP_SECRET set test', () => {
    const config = require('../config.js');
    expect(config.FB_APP_SECRET).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('secret>');    
  });

  it('FB_VERIFY_TOKEN set test', () => {
    const config = require('../config.js');
    expect(config.FB_VERIFY_TOKEN).not.toBe(null);
  });

  it('CENSUS_DATA_API_KEY set test', () => {
    const config = require('../config.js');
    expect(config.CENSUS_DATA_API_KEY).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('key>');    
  });
  
});