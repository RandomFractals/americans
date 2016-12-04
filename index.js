'use strict';

// express app imports
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');

// app config
const config = require('./config.js');

// set web server port
const PORT = process.env.PORT || 8445;

// create and start express web app
const app = express();
app.use(({method, url}, response, next) => {
  response.on('finish', () => {
    console.log(`${response.statusCode} ${method} ${url}`);
  });
  next();
});

// create FB Messenger with wrapped Wit.AI interface instance 
const messenger = require('./messenger.js');

// verify FB request signature for all requests
app.use( bodyParser.json( {verify: messenger.verifyFacebookRequestSignature}));

// listen for requests
app.listen(PORT);
console.log(`index.js::Listening on port: ${PORT}...`);

// create user-friendly web app info page handler
app.get('/', (req, res) => {
  // TODO: create simple html that describes Americans bot functionality,
  // provides links for FB Messenger and later Slack webhooks config, 
  // and sample bot usage examples to query census data
  res.send('"Only those who will risk going too far can possibly find out how far one can go." - T.S. Eliot');
});


/*----------------------------- FB Messenger Webhook Routes -----------------------------------------*/

// GET endpoint for FB page subscription verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
    console.log('/webhook::GET:validating webhook...');        
    // send hub.challenge back to confirm fb verify token validation
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('/webhook::GET:Failed /webhook validation. Make sure your validation tokens match!');
    res.sendStatus(400); // or 403 - forbidden
  }
});

// FB message POST request handler
app.post('/webhook', (req, res) => {  
  // get Messenger request payload
  const data = req.body;
  if (data.object === 'page') {
    // iterate over each entry - there may be multiple if batched
    data.entry.forEach(entry => {
      // process messaging requests 
      entry.messaging.forEach( event => {
        if (event.message && !event.message.is_echo) {
          // let messenger handle message response
          messenger.processMessage(event);
          // just log other messenger event types for now: 
        } else if (event.message && event.message.is_echo) {
          console.log('/webhook::POST:echo message sent:', JSON.stringify(event));
        } else if (event.read) {
          console.log('/webhook::POST:message read:', JSON.stringify(event));
        } else if (event.delivery) {
          console.log('/webhook::POST:message delivered:', JSON.stringify(event));
        } else {
          console.log('/webhook::POST:Unknown message event request:', JSON.stringify(event));
        }        
      });
    });
  }
  res.sendStatus(200);
});
