'use strict';

// load app config
const config = require('./src/utils/app-config.js');

// You can find your project ID in your Dialogflow agent settings
const projectId = 'americans-aa6dc'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'americans-dalogflow-cli-test';
const query = 'hello';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');

// see these docs for google service account auth:
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/latest/guides/authentication
// and dialog flow sessions client config:
// https://github.com/dialogflow/dialogflow-nodejs-client-v2/blob/master/src/v2beta1/sessions_client.js
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: config.DIALOGFLOW_SERVICE_ACCOUNT_FILE
});

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: languageCode,
    },
  },
};

// Send request and log result
sessionClient
  .detectIntent(request)
  .then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });