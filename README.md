# Klesk
Klesk is a Slack service to store and return ladder data for Quake Live or whatever game you like.

[![Build Status](https://travis-ci.org/TheOneYouDontLike/Klesk.svg?branch=master)](https://travis-ci.org/TheOneYouDontLike/Klesk)

## Features
- `newladder <laddername> [<keyword>]`

creates a new ladder with name `<laddername>`

map selection: a random map will be assigned to the ladder if `<keyword>` is not specified

`<keyword>` makes map selection ignore maps with negative `<keyword>` count and choose maps with higher `<keyword>` vote count more often

sends notification to configured slack webhook about a new ladder

- `joinladder <laddername>`

adds your slack name to ladder `<laddername>` and initialises matches against all other participants
sends notification to configured slack webhook about a new player in the ladder

- `addresult <laddername> <player1> <player2> [<score>]`

adds match result, the winner should be indicated by a `+` sign before their name
you can optionally provide match `<score>` which will later be displayed with match result
sends notification to configured slack webhook about match result

- `leaveladder <laddername>`

removes all your matches from ladder `<laddername>`
sends notification to configured slack webhook about player leaving the ladder

- `ranking <laddername>`

sends the list of `<laddername>`'s matches with their results to your @slackbot slack channel

- `showstats <laddername>`

sends the list of your matches in ladder `<laddername>` with their results to your @slackbot slack channel

- `showladders`

lists all created ladders

- `upvotemap <mapname> <keyword>`
- `downvotemap <mapname> <keyword>`

adds (`upvotemap`) or subtracts (`downvotemap`) 1 from vote `<keyword>` count for map `<mapname>`
the number of votes is used when selecting maps for new ladders (see `newladder`)

- `listmaps`

lists all configured maps with keyword vote breakdown

## Installation
Simply run inside Klesk directory:

`npm install`

Running application requires: webpack and nodemon.

`npm install -g webpack nodemon`

### Running Klesk for development
Testing the application requires mocha.

`npm install -g mocha`

`webpack` (or `webpack -w` for watching files) for building the app.

`npm run watch` for watching build output and restarting service.

Before building create **config.js** file in the root directory.
Just copy following configuration and customize what you need

```
export default {
  port: 1666,
  storageFilename: 'ladders.json',
  mapsFilename: 'maps.json',
  notificationWebhookAddress: 'https://your-incoming-slack-hook',
  notificationChannel: '#notifications', //OPTIONAL: if not set then slack incoming-webhook default channel will be used
  botUsername: 'Klesk', //OPTIONAL: if not set then slack incoming-webhook name will be used
  botIconUrl: 'http://absolute-path-to-your-bot-icon' //OPTIONAL: if not set slack default bot icon will be used
  logErrorsToFile: true, // whether to log to file or only to console
  errorsLogPath: './'
};
```

maps.json schema example:

```
[
  { "name": "Campgrounds" },
  { "name": "Aerowalk" }
  ...
]
```
