const Twit = require('twit');

const { randomSequence, sequenceToUrl } = require('./sequence');

let config;

if (isDevelopment()) {
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

async function tweet() {
  try {
    const url = await sequenceToUrl(randomSequence());

    const status = await getStatus(url);

    const { data } = await client.post('statuses/update', { status });

    console.log(`Tweet created: ${ data.text }`);
  } catch(err) {
    console.error(err.message);
  }
}

async function getStatus(url) {
  const number = await getNumber();

  return `🥁 Sequence #${ number } created by your friendly bot: ${ url }`;
}

const regex = /Sequence #([0-9]+) created by your friendly bot/;

async function getNumber() {
  const { data } = await client.get('statuses/user_timeline', { screen_name: 'philippfromme' });

  const lastTweet = data.find(({ text }) => {
    return regex.test(text);
  });

  return lastTweet && lastTweet.text.match(regex)[ 1 ] || 1;
}

function isDevelopment() {
  return process.argv.slice(2).includes('development');
}

tweet();
