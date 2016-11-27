'use strict';

// crypto import for random FB verify token generation
const crypto = require('crypto');

// initialize .env vars
const config = require('dotenv').config();

// NOTE: set up your .env first
// see .env.template for more info

// get Wit.ai token from config
const WIT_TOKEN = process.env.WIT_TOKEN;
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN');
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
    console.log(`config::crypto.randomBytes::FB Verify Token: ${FB_VERIFY_TOKEN}`);
  });
}

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  FB_APP_SECRET: FB_APP_SECRET,
};