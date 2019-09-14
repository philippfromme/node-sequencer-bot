const Twit = require('twit');

let config;

if (process.argv.slice(2).includes('development')) {
  config = require('../config.json');
} else {
  config = {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
  };
}

const client = new Twit(config);

function tweet(status) {
  client.post('statuses/update', { status }, (err, data, response) => {
    if (err) {
      console.error(err);
    }

    console.log(data);
  });
}

function getStatus(url) {
  return `[${ getDate() }] A new sequence made by your friendly bot: ${ url }`;
}

function getDate() {
  const date = new Date();

  return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() } ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
}

tweet(getStatus('https://philippfromme.github.io/node-sequencer-demo/'));