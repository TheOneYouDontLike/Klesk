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

```
export default {
  port: 1666,
  storageFilename: 'ladders.json',
  mapsFilename: 'maps.json',
  notificationWebhookAddress: 'https://your-incoming-slack-hook',
  notificationChannel: '#notifications',
  botUsername: 'Klesk'
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
