'use strict';

/**
 * DialogFlow V2 beta1 bot AI CLI test based on:
 * 
 * https://github.com/dialogflow/dialogflow-nodejs-client-v2/blob/master/samples/detect.js
 */

// load our bot app config
const config = require('./src/utils/app-config.js');

// goog.protobuf.Struct to json util
const structjson = require('./src/utils/structjson.js')

// create test bot query
const sessionId = 'americans-dalogflow-cli-test';
const query = 'hello';
const languageCode = 'en-US';

// create dialogflow client
const dialogflow = require('dialogflow');

// see these docs for google service account auth:
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/latest/guides/authentication
// and dialog flow sessions client config:
// https://github.com/dialogflow/dialogflow-nodejs-client-v2/blob/master/src/v2beta1/sessions_client.js

// carete test bot client chat session
const sessionClient = createBotChatSesssion()

// define session path
const sessionPath = sessionClient.sessionPath(config.GOOGLE_PROJECT_ID, sessionId);

// create test query
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: languageCode,
    },
  },
};

// send bot ai request and log results
sessionClient
  .detectIntent(request)
  .then(responses => {
    console.log('Detected intent:', responses);
    console.log('---')

    // get and log query results for init bot app debug
    const result = responses[0].queryResult;
    logQueryResult(sessionClient, result) // responses[0].gueryResult)
  })
  .catch(err => {
    console.error('ERROR:', err);
  });


/**
 * ---------- DialogFlow V2 Beta 1 Bot AI Detect Text/Event Handlers --------------
 */

/**
 * Creates new DialogFlow bot AI chat session.
 */
function createBotChatSesssion() {
  return new dialogflow.SessionsClient({
    keyFilename: config.DIALOGFLOW_SERVICE_ACCOUNT_FILE
  });    
}


/**
 * Runs DialogFlow chatbot text queries.
 *
 * @param {*} projectId Bot project id
 * @param {*} sessionId Bot chat session id
 * @param {*} queries Bot queries
 * @param {*} languageCode Bot lang code
 */
function detectTextIntent(projectId, sessionId, queries, languageCode) {
  if (!queries || !queries.length) {
    return; // abort mission! :)
  }

  // create new dialogflow client session
  const sessionClient = createBotChatSesssion();
  
  // create bot chat session
  const chatSession = sessionClient.sessionPath(projectId, sessionId);
  
  let promise;
  
  // create bot query requests
  for (const query of queries) {
    const request = {
      session: chatSession,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
  
    if (!promise) { // first bot query
      console.log(`Sending query "${query}"`);
      promise = sessionClient.detectIntent(request);
    } 
    else {
      promise = promise.then(responses => {
        console.log('Detected intent');
        const response = responses[0];
        logQueryResult(sessionClient, response.queryResult);
  
        // Tip: use output contexts as input contexts for the next query
        response.queryResult.outputContexts.forEach(context => {
          // Note: there is a bug in gRPC that the returned google.protobuf.Struct
          // value contains fields with value of null, which causes error when decoding it back. 
          // Hack: Converting to JSON and back to protobuf removes those values
          context.parameters = structjson.jsonToStructProto(
            structjson.structProtoToJson(context.parameters)
          );
        });
        request.queryParams = {
          contexts: response.queryResult.outputContexts,
        };
  
        console.log(`Sending query "${query}"`);
        return sessionClient.detectIntent(request);
      });
    }
  }
  
  // process bot AI responses
  promise.then(responses => {
    console.log('Detected intent');
    logQueryResult(sessionClient, responses[0].queryResult);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
  
} // end of detectTextIntent()


/**
 * -------------------- Bot Log Methods -------------------------------
 */

  /**
   * Logs dialogflow bot ai response.
   * 
   * @param {*} sessionClient DialogFlow session client instance.
   * @param {*} result DialogFlow query result.
   */
function logQueryResult(sessionClient, result) {
  // create context client for bot ai debug
  const contextClient = new dialogflow.ContextsClient({
    keyFilename: config.DIALOGFLOW_SERVICE_ACCOUNT_FILE    
  });

  // log query, repsonse, and intent
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  // get params
  const parameters = JSON.stringify(
    structjson.structProtoToJson(result.parameters)
  );

  // log params and output context
  console.log(`  Parameters: ${parameters}`);
  if (result.outputContexts && result.outputContexts.length) {
    console.log(`  Output contexts:`);
    result.outputContexts.forEach(context => {
      const contextId = contextClient.matchContextFromContextName(context.name);
      const contextParameters = JSON.stringify(
        structjson.structProtoToJson(context.parameters)
      );
      console.log(`    ${contextId}`);
      console.log(`      lifespan: ${context.lifespanCount}`);
      console.log(`      parameters: ${contextParameters}`);
    });
  }
} // end of logQueryResult()


/**
 * ------------------------ DialoFlow Bot AI CLI Setup ---------------------------
 */
const cli = require(`yargs`)
  .demand(1)
  .options({
    sessionId: {
      alias: 's',
      default: require('uuid/v1')(),
      type: 'string',
      requiresArg: true,
      description:
        'Bot chat session id. Default: random UUID',
    },
    lang: {
      alias: 'l',
      default: 'en-US',
      type: 'string',
      requiresArg: true,
      description: 'Bot text query language code',
    },
  })
  .command(
    `text`,
    `Runs DialogFlow Bot AI text queries`,
    {
      queries: {
        alias: 'q',
        array: true,
        string: true,
        demandOption: true,
        requiresArg: true,
        description: 'An array of text queries',
      },
    },
    opts =>
      detectTextIntent(
        opts.sessionId,
        opts.queries,
        opts.languageCode
      )
  )
  .example(
    `node $0 text -q "hello" "USA population" "How many people live in Chicago" ` +
      `"Brewster county population"`
  )
  .example(`node $0 event get_population`)
  .wrap(120)
  .recommendCommands()
  .epilogue(
    `For more information, see https://cloud.google.com/conversation/docs`
  )
  .help()
  .strict();

if (module === require.main) {
  cli.parse(process.argv.slice(2));
}
