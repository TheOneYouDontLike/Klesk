# Klesk
Klesk is a Slack service to store and return ladder data for Quake Live or whatever game you like.

## Features
- Creating new ladder
- Joining existing ladder
- Adding match result
- Showing user statistics for ladder
- Showing ranking

## Installation
Simply run inside Klesk directory:

`npm install`

Running and testing application requires: mocha, webpack and nodemon.

`npm install -g mocha webpack nodemon`

### Running Klesk for development
`webpack` (or `webpack -w` for watching files) for building the app.

`npm run watch` for watching build output and restarting service.

Before building create **config.js** file in the root directory.
[] means the setting is optional

```
export default {
  port: 1666,
  storageFilename: 'ladders.json',
  mapsFilename: 'maps.json',
  [notificationChannel: '#notifications',] //if not set then slack incoming-webhook default channel will be used
  [botUsername: 'Klesk',] //if not set then slack incoming-webhook name will be used
  [botIconUrl: 'http://absolute-path-to-your-bot-icon']
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
