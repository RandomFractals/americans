'use strict';

// load app config
const config = require('./src/utils/app-config.js');

// goog.protobuf.Struct to json util
const structjson = require('./src/utils/structjson.js')

// bot project id from from https://dialogflow.com/docs/agents#settings
const projectId = config.GOOGLE_PROJECT_ID;
const sessionId = 'americans-dalogflow-cli-test';
const query = 'hello';
const languageCode = 'en-US';

// create dialogflow client
const dialogflow = require('dialogflow');

// see these docs for google service account auth:
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/latest/guides/authentication
// and dialog flow sessions client config:
// https://github.com/dialogflow/dialogflow-nodejs-client-v2/blob/master/src/v2beta1/sessions_client.js

// carete bot client session
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: config.DIALOGFLOW_SERVICE_ACCOUNT_FILE
});

// define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

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


function logQueryResult(sessionClient, result) {
  // create context client
  const contextClient = new dialogflow.ContextsClient({
    keyFilename: config.DIALOGFLOW_SERVICE_ACCOUNT_FILE    
  });

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
}
