jest.dontMock('../config.js');

describe('Const setting test', () => {
  /*
  it('No WIT_TOKEN test',  () => {
    require('../config.js');
   expect(config.WIT_TOKEN).toThrow(new Error('missing WIT_TOKEN'));
  	});*/

  it('WIT_TOKEN test', () => {
    process.env.WIT_TOKEN = 'wit_token';
    var config = require('../cofig.js');
    expect(config.WIT_TOKEN).toEqual('wit_token');
  });

  it('No FB_PAGE_TOKEN test', () => {
    var config = require('../config.js');
    expect(config.FB_PAGE_TOKEN).toEqual(null);
  });

  it('No FB_PAGE_TOKEN test', () => {
    process.env.FB_PAGE_TOKEN = 'fb_token';
    var config = require('../config.js');
    expect(config.FB_PAGE_TOKEN).toEqual('fb_token');
  });

  it('No FB_VERIFY_TOKEN test', () => {
    var config = require('../config.js');
    expect(config.FB_VERIFY_TOKEN).not.toBe(null);
  });

  it('No FB_VERIFY_TOKEN test', () => {
    process.env.FB_VERIFY_TOKEN = 'fb_token_test';
    var config = require('../config.js');
    expect(config.FB_VERIFY_TOKEN).toEqual('fb_token_test');
  });
});