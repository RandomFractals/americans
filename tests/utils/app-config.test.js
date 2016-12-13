jest.dontMock('../../src/utils/app-config.js');

describe('App Config Tests', () => {

  const config = require('../../src/utils/app-config.js');
  
  xit('No WIT_TOKEN test',  () => {
    expect(config.WIT_TOKEN).toThrow(new Error('missing WIT_TOKEN'));
  });

  it('WIT_TOKEN is set', () => {
    expect(config.WIT_TOKEN).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('token>');
  });

  it('FB_PAGE_TOKEN is set', () => {
    expect(config.FB_PAGE_TOKEN).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('token>');    
  });

  it('FB_APP_SECRET is set', () => {
    expect(config.FB_APP_SECRET).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('secret>');    
  });

  it('FB_VERIFY_TOKEN is created', () => {
    expect(config.FB_VERIFY_TOKEN).not.toBe(null);
  });

  it('CENSUS_DATA_API_KEY is set', () => {
    expect(config.CENSUS_DATA_API_KEY).not.toBe(null);
    expect(config.WIT_TOKEN).not.toContain('key>');    
  });
  
});