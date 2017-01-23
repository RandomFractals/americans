jest.dontMock('../../src/utils/app-config.js');

describe('App Config Tests', () => {

  const config = require('../../src/utils/app-config.js');
  
  xit('No WIT_AI_TOKEN test',  () => {
    expect(config.WIT_AI_TOKEN).toThrow(new Error('missing WIT_AI_TOKEN'));
  });

  it('WIT_AI_TOKEN is set', () => {
    expect(config.WIT_AI_TOKEN).not.toBe(null);
    expect(config.WIT_AI_TOKEN).not.toContain('token>');
  });

  it('API_AI_TOKEN is set', () => {
    expect(config.API_AI_TOKEN).not.toBe(null);
    expect(config.API_AI_TOKEN).not.toContain('token>');
  });

  it('CENSUS_DATA_API_KEY is set', () => {
    expect(config.CENSUS_DATA_API_KEY).not.toBe(null);
    expect(config.CENSUS_DATA_API_KEY).not.toContain('key>');    
  });

  it('SLACK_WEBHOOK_URL is set', () => {
    expect(config.SLACK_WEBHOOK_URL).not.toBe(null);
    expect(config.SLACK_WEBHOOK_URL).not.toBe('<your incoming Slack bot webhook url>');
  });

  it('FB_PAGE_TOKEN is set', () => {
    expect(config.FB_PAGE_TOKEN).not.toBe(null);
    expect(config.FB_PAGE_TOKEN).not.toContain('token>');
  });

  it('FB_APP_SECRET is set', () => {
    expect(config.FB_APP_SECRET).not.toBe(null);
    expect(config.FB_APP_SECRET).not.toContain('secret>');
  });

  it('FB_VERIFY_TOKEN is created', () => {
    expect(config.FB_VERIFY_TOKEN).not.toBe(null);
  });
  
});