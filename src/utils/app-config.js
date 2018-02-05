'use strict';

// crypto import for random FB verify token generation
const crypto = require('crypto');

// initialize .env vars
const config = require('dotenv').config({silent:true});

// NOTE: set up your .env first
// see .env.template for more info

// TODO: convert this mess to single config obj export

// get bot AI config
const BOT_AI = process.env.BOT_AI;

// get DialgoFlow service account file path
const DIALOGFLOW_SERVICE_ACCOUNT_FILE = process.env.DIALOGFLOW_SERVICE_ACCOUNT_FILE

// get Google api.ai token from config
const API_AI_TOKEN = process.env.API_AI_TOKEN;
if (BOT_AI === 'api.ai' && !API_AI_TOKEN) {
  throw new Error('Missing API_AI_TOKEN');
}

// get Wit.ai token from config
const WIT_AI_TOKEN = process.env.WIT_AI_TOKEN;
if (BOT_AI === 'wit.ai' && !WIT_AI_TOKEN) {
  throw new Error('Missing WIT_AI_TOKEN');
}

// get incoming Slack webhook url
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
if (!SLACK_WEBHOOK_URL) {
  throw new Error('Missing SLACK_WEBHOOK_URL');
}

// get FB page token and app secret
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_PAGE_TOKEN) { 
  throw new Error('Missing FB_PAGE_TOKEN'); 
}
if (!FB_APP_SECRET) { 
  throw new Error('Missing FB_APP_SECRET');
}

// get FB /webhook subscription verification token
// see https://developers.facebook.com/docs/graph-api/webhooks#setup
let FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
  // create random FB verification token  
  crypto.randomBytes(8, (err, buff) => {
    if (err) throw err;
    FB_VERIFY_TOKEN = buff.toString('hex');
    // output new FB verification token for messenger app config
    //console.log(`Config.crypto.randomBytes(): FB_VERIFY_TOKEN=${FB_VERIFY_TOKEN}`);
  });
}

// get Census data service api key
const CENSUS_DATA_API_KEY = process.env.CENSUS_DATA_API_KEY;
if (!CENSUS_DATA_API_KEY) {
  throw new Error('Missing CENSUS_DATA_API_KEY');
}

module.exports = {
  BOT_AI: BOT_AI,
  DIALOGFLOW_SERVICE_ACCOUNT_FILE: DIALOGFLOW_SERVICE_ACCOUNT_FILE,  
  API_AI_TOKEN: API_AI_TOKEN,
  WIT_AI_TOKEN: WIT_AI_TOKEN,
  CENSUS_DATA_API_KEY: CENSUS_DATA_API_KEY,
  SLACK_WEBHOOK_URL: SLACK_WEBHOOK_URL,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  FB_APP_SECRET: FB_APP_SECRET
};