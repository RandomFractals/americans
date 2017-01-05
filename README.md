# Americans

Bots demo project of US pop, biz, trade, incomes, and housing data stats

Think 'Quick Facts' census data bot you can ping for some USA pop data info:

https://www.census.gov/quickfacts/table/PST045216/00

## Project Info

Americans bot Facebook home page: https://www.facebook.com/Americans-1836666999901817/

Alpha v. webhooks hosted on heroku: https://americans.herokuapp.com/

Current Wit.AI bot brains: https://wit.ai/RandomFractals/americans/stories

API.AI bot engine hookup and Slack chat integration coming to chat clients near you soon.

Latest FB Messenger interface v.: 

![Alt text](https://github.com/RandomFractals/americans/blob/master/screens/AmericansBotMVP.png?raw=true 
 "latest") 

05-01-2017 Update: 

Huston, we got Slack lift off! :)

![Alt text](https://github.com/RandomFractals/americans/blob/master/screens/AmericansBotUSAPop.png
 "Slack Americans bot dev in progress...") 

https://twitter.com/TarasNovak/status/817072830873473024

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
and service api access keys for Wit.ai, FB Messenger, and Census data calls.

Note: only WIT_TOKEN and CENSUS_DATA_API_KEY .env vars are required for local bot.js CLI runs.

## Test
### Jest
```bash
npm test 
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
FB Messenger Platform Quick Start:

* https://developers.facebook.com/docs/messenger-platform/quickstart

Wit.AI Node.js SDK:

* https://github.com/wit-ai/node-wit

## Credits
Some borrowed and refactored code from:

* https://github.com/jw84/messenger-bot-tutorial
* https://github.com/hunkim/Wit-Facebook


# License

Copyright © 2017 Random Fractals, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.