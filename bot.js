'use strict';

// see: https://wit.ai/RandomFractals/americans/stories
// for wit.ai bot stories supported by this interactive bot test

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
        console.log(`> bot.send() response: ${JSON.stringify(response)}`);
        return resolve();
      });
    },
    greeting({sessionId, context, text, entities}) {
      console.log('> bot.greeting():');
      console.log(`\t sessionId: ${sessionId}`);
      logBotInfo(context, entities, text);
      return Promise.resolve(context);
    },
    getPopulation({sessionId, context, text, entities}) {
      console.log('> bot.getPopulation() request:');
      logBotInfo(context, entities, text);
    },
    thanks({sessionId, context, text, entities}) {
      console.log('> bot.thanks():');
      logBotInfo(context, entities, text);
    },    
    disconnect({sessionId, context, text, entities}) {
      console.log('> bot.disconnect():');
      logBotInfo(context, entities, text);
    }
  },
  logger: new log.Logger(log.DEBUG) //INFO)  
});


/**
 * Logs wit.ai message text request, context, and entities 
 * for interactive bot ai story testing.
 */
function logBotInfo(context, entities, text) {
  console.log(`\t message: ${text}`);  
  console.log(`\t context: ${JSON.stringify(context)}`);
  console.log(`\t entities: ${JSON.stringify(entities)}`);
}

// start interactive wit.ai client
interactive(witAiClient);
