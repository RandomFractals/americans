'use strict';

// load app config
const config = require('./src/utils/config.js');

// wit.ai imports
const {Wit, interactive, log} = require('node-wit');

// create wit.ai client
const witAiClient = new Wit({
  accessToken: config.WIT_TOKEN,
  actions: {
    send(request, response) {
      return new Promise( function(resolve, reject) {
        console.log( JSON.stringify(response) );
        return resolve();
      });
    },
    myAction({sessionId, context, text, entities}) {
      console.log(`Session ${sessionId} received message: ${text}`);
      console.log(`Current context: ${JSON.stringify(context)}`);
      console.log(`Wit extracted entities: ${JSON.stringify(entities)}`);
      return Promise.resolve(context);
    }
  },
  logger: new log.Logger(log.DEBUG) // optional  
});

// start interactive wit.ai client
interactive(witAiClient);