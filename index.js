'use strict';

// express app imports
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const http = require('http');
const path = require('path');

// app config
const config = require('./src/utils/app-config.js');

// set web server port
const PORT = process.env.PORT || 8445;

// create express web app
const app = express();
app.set('port', PORT);
app.use(({method, url}, response, next) => {
  response.on('finish', () => {
    console.log(`${response.statusCode} ${method} ${url}`);
  });
  next();
});

// create and start http server
const server = http.createServer(app);
server.listen(PORT);

// create Messenger interface instance
const Messenger = require('./src/clients/messenger.js');
const messenger = new Messenger(config);

// verify FB request signature for all requests
app.use(bodyParser.json()); //{verify: messenger.verifyRequestSignature}));

app.use(bodyParser.urlencoded({ extended: true }));

// hook to serve static html files
app.use(express.static(path.join(__dirname, './')));

// listen for requests
//app.listen(PORT);
console.log(`index.js: Listening on Port: ${PORT}...`);

// create user-friendly web app info page handler
/*app.get('/', (req, res) => {
  // TODO: create simple html that describes Americans bot functionality,
  // provides links for FB Messenger and later Slack webhooks config, 
  // and sample bot usage examples to query census data
  //res.send('"Only those who will risk going too far can possibly find out how far one can go." - T.S. Eliot');
  res.redirect('./index.html');
});*/

/*----------------------- Americans Bot Slash Commands :) -----------------------------------------*/

app.get('/', (req, res) => {
  processSlashQuery(req.query, res);
});

app.post('/', (req, res) => {
  processSlashQuery(req.body, res);
});

function processSlashQuery(query, response) {
  if(query.token !== process.env.SLACK_CLIENT_TOKEN) {
    // not a Slack slash command query request
    return; // bail out!
  }

  if (query.text) {
    let messageText = query.text;
    // echo it for now
    console.log(JSON.stringify(response));
    response.json(`You asked about: ${messageText}`);
  }
}

/*----------------------------- Slack OAuth Routes -------------------------------------------------*/

// Slack ping verification handler
app.post('/slack', (req, res) => {
  if(req.body.token !== process.env.SLACK_CLIENT_TOKEN) {
    // not a Slack slash command query request
    return; // bail out!
  }

  // echo Slack ping verification request
  console.log(req.body.challenge);
  res.send(req.body.challenge);
});

// GET endpoint for Slack OAuth
app.get('/slack', function(req, res){ 
  let data = {form: { 
    client_id: process.env.SLACK_CLIENT_ID, 
    client_secret: process.env.SLACK_CLIENT_SECRET, 
    code: req.query.code 
  }}; 

  // request OAuth token
  request.post('https://slack.com/api/oauth.access', data, function (error, response, body) { 
    if (!error && response.statusCode == 200) { 
      // get OAuth token
      let token = JSON.parse(body).access_token; 
      // get Slack team info to rediret to team Url after auth
      request.post('https://slack.com/api/team.info', 
        {form: {token: token}}, function (error, response, body) { 
        if (!error && response.statusCode == 200) { 
          if(JSON.parse(body).error == 'missing_scope') {
            res.send('Americans bot has been added to your team!');
          } else { 
            // get team domain
            let team = JSON.parse(body).team.domain; 
            // redirect to Slack team domain after auth
            res.redirect('http://' +team+ '.slack.com');
          }
        } 
      });
    }
  });
});

/*----------------------------- FB Messenger Webhook Routes -----------------------------------------*/

// GET endpoint for FB page subscription verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
    console.log('/webhook: Validating webhook...');        
    // send hub.challenge back to confirm fb verify token validation
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('/webhook: Failed /webhook validation. Make sure your validation tokens match!');
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
          console.log('/webhook: Echo Message Sent:', JSON.stringify(event));
        } else if (event.read) {
          console.log('/webhook: Message Read:', JSON.stringify(event));
        } else if (event.delivery) {
          console.log('/webhook: Message Delivered:', JSON.stringify(event));
        } else {
          console.log('/webhook: Unknown Message Event Request:', JSON.stringify(event));
        }        
      });
    });
  }
  res.sendStatus(200);
});
