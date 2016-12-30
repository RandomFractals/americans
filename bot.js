'use strict';

// see: https://wit.ai/RandomFractals/americans/stories
// for wit.ai bot stories supported by this interactive bot test

// load app config
const config = require('./src/utils/app-config.js');

// wit.ai imports
const {Wit, interactive, log} = require('node-wit');

// import numeral for numbers formating
const numeral = require('numeral');

// create census data service
const Census = require('./src/census/census.js');
const censusService = new Census(config);

// create wit.ai client
const witAiClient = new Wit({
  accessToken: config.WIT_TOKEN,
  actions: {
    send(request, response) {
      const {sessionId, context, entities} = request;
      const {text, quickreplies} = response;      
      return new Promise( function(resolve, reject) {
        console.log(`> bot.send() request: ${JSON.stringify(request)}`);        
        console.log(`> bot.send() response: ${JSON.stringify(response)}`);
        return resolve();
      });
    },
    greeting({sessionId, context, text, entities}) {
      console.log(`\n> bot.greeting("${text}"):`);
      console.log(`\t sessionId: ${sessionId}`);
      logBotInfo(context, entities, text);
      return Promise.resolve(context);
    },
    getPopulation({sessionId, context, text, entities}) {
      let location = getFirstEntityValue(entities, 'location');
      if (!location) {
        location = 'usa'; // default to usa
      }
      console.log(`\n> bot.getPopulation(("${location}"):`);
      censusService.getPopulation(location)
        .then( (response) => {
          console.log(`\n>~${numeral(response.population).format('0,0')} people live in ${response.location}`);
          context.location = response.location;
        });
      logBotInfo(context, entities, text);
      return Promise.resolve(context);      
    },
    thanks({sessionId, context, text, entities}) {
      console.log(`\n> bot.thanks("${text}"):`);
      logBotInfo(context, entities, text);
      return Promise.resolve(context);      
    },    
    disconnect({sessionId, context, text, entities}) {
      console.log(`\n> bot.disconnect("${text}"):`);
      logBotInfo(context, entities, text);
      return Promise.resolve(context);      
    }
  },
  logger: new log.Logger(log.DEBUG) //INFO)  
});


/**
 * Gets first entity value from wit.ai entities collection.
 * 
 * @param entities Wit.ai entities collection.
 * @param entityName Name of the extracted entity.
 */
function getFirstEntityValue(entities, entityName) {
  const entityValue = entities && entities[entityName] &&
    Array.isArray(entities[entityName]) &&
    entities[entityName].length > 0 &&
    entities[entityName][0].value;
  if (!entityValue) {
    return null;
  }
  return typeof entityValue === 'object' ? entityValue.value : entityValue;
}


/**
 * Logs wit.ai message text request, context, and entities 
 * for interactive bot ai story testing.
 */
function logBotInfo(context, entities, text) {
  console.log(`\t message: ${text}`);  
  console.log(`\t context: ${JSON.stringify(context)}`);
  console.log(`\t entities: ${JSON.stringify(entities)}\n`);
}

// start interactive wit.ai client
interactive(witAiClient);
