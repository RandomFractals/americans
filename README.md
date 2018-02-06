# Americans

Americans is a hybrid ES5/ES6 node.js chatbot demo app for
USA census data pop, biz, trade, incomes, crime, education, and housing stats queries.

Think 'Quick Facts' census data bot you can ping for some USA pop data info:

https://www.census.gov/quickfacts/table/PST045216/00

# Project Info

DialogFlow Americans Bot proj. v2.0 beta migration announcement:

https://plus.google.com/109626352267904541757/posts/MqaGhe5LXki

New Americans Bot DialogFlow agent configuration: https://bot.dialogflow.com/americans

Old Americans bot home page: https://americans.herokuapp.com/

More project info on linkedin: https://www.linkedin.com/pulse/americans-bot-app-taras-novak

See Twitter devlogs for the latest daily on this project:

https://twitter.com/hashtag/AmericansBot?src=hash

---------------------------------------------------------------------------------

Old Americans bot Facebook page: https://www.facebook.com/Americans-1836666999901817/

Retiring Wit.AI bot brains: https://wit.ai/RandomFractals/americans/stories

More census data stats coming to chat clients near you soon.

# Latest FB Messenger interface v.: 

![Alt text](https://github.com/RandomFractals/americans/blob/master/screens/AmericansBotMVP.png?raw=true 
 "latest") 

# Americans bot home page: https://americans.herokuapp.com/

![Alt text](https://github.com/RandomFractals/americans/blob/master/screens/AmericansBotHomePageTake3.png
 "Americans Bot home page dev in progress...") 

## Build

```bash
git clone https://github.com/RandomFractals/americans
cd americans
npm install
```

## Config
```bash
cp .env.template .env
```
Follow instructions in .env config file to procure required tokens 
and service api access keys for api.ai, Wit.ai, FB Messenger, Slack, and Census API data calls.

Note: only WIT_AI_TOKEN or API_AI_TOKEN, and CENSUS_DATA_API_KEY .env vars are required for local bot.js CLI runs.

## Test
### Jest
```bash
npm test 
```

### DialogFlow CLI

```
node dialogflow-cli --help
```

### Console
```bash
node bot.js
``` 

## Run
```bash
npm start 
```

## Dev Guides

* http://blog.potatobon.com/2018/01/26/google-assistant-vs-amazon-echo/

* https://codelabs.developers.google.com/?cat=Assistant

* https://github.com/dialogflow/dialogflow-fulfillment-nodejs#quick-start

* https://github.com/dialogflow/dialogflow-nodejs-client-v2

* https://cloud.google.com/nodejs/getting-started/hello-world

--------------------------------------------------------------------------

## Retring Americans Bot v1.4 alpha dev docs 

*NOTE:* these are most likely out of date since both wit.ai and api.ai finished their betas
and went in totally different directions focusing on things most important for their target audience
and platforms.

See FB sunsetting their bot engine stories post here: https://wit.ai/blog/2017/07/27/sunsetting-stories

Google rebranded to DialogFlow and extended their bots reach, 
which will be the focus of further docs and code updates of this v2.0 feature branch of Americans bot.

----------------------------------------------------------------------------

Google api.ai docs:

* https://docs.api.ai/docs/authentication

Wit.AI Node.js SDK:

* https://github.com/wit-ai/node-wit

FB Messenger Platform Quick Start:

* https://developers.facebook.com/docs/messenger-platform/quickstart

Slack API:

* https://api.slack.com/slack-apps

## Credits
Some borrowed and refactored code from:

* https://github.com/jw84/messenger-bot-tutorial
* https://github.com/hunkim/Wit-Facebook
* https://github.com/girliemac/slack-httpstatuscats


# License

Copyright © 2018 Random Fractals, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
