# Americans

Bots demo project of US pop, biz, trade, incomes, and housing data stats

Think 'Quick Facts' census data bot you can ping for some USA pop data info:

https://www.census.gov/quickfacts/table/PST045216/00

## Project Info

Home of Americans bot on FB: https://www.facebook.com/Americans-1836666999901817/

Alpha v. webhooks hosted on heroku: https://americans.herokuapp.com/

Current Wit.AI bot brains: https://wit.ai/RandomFractals/americans/stories

API.AI bot engine hookup and Slack chat integration coming to chat clients near you soon.

Latest interface v.

![Alt text](https://github.com/RandomFractals/americans/blob/master/screens/AmericansBotMVP.png?raw=true 
 "latest") 

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
