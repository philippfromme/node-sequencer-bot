const zlib = require('zlib');

const { isNumber } = require('min-dash');

const SOUNDS = [
  'clap',
  'closedhat',
  'kick',
  'openhat',
  'snare',
  'tom'
];

const TIME_SIGNATURES = [
  '2',
  '4',
  '8',
  '16'
];

const BASE_URL = 'https://philippfromme.github.io/node-sequencer-demo/?';

const MIN_NUMBER_EMITTERS = 2,
      MAX_NUMBER_EMITTERS = 4,
      MIN_NUMBER_LISTENERS = 4,
      MAX_NUMBER_LISTENERS = 8;

function randomInt(min, max) {
  if (!isNumber(max)) {
    max = min;
    min = 0;
  }

  return Math.round(Math.random() * (max - min)) + min;
}

function randomChoice(array) {
  return array[ randomInt(array.length - 1) ];
}

function randomEmitters() {
  return Array(randomInt(MIN_NUMBER_EMITTERS, MAX_NUMBER_EMITTERS)).fill().map(randomEmitter);
}

function randomListeners() {
  return Array(randomInt(MIN_NUMBER_LISTENERS, MAX_NUMBER_LISTENERS)).fill().map(randomListener);
}

function randomRoot() {
  const tempo = randomInt(110, 130);

  const soundKit = 'alkaloid';

  return {
    isRoot: true,
    soundKit,
    tempo
  };
}

function randomEmitter() {
  return {
    type: 'nodeSequencer:Emitter',
    timeSignature: randomChoice(TIME_SIGNATURES),
    x: randomInt(500),
    y: randomInt(500)
  };
}

function randomListener() {
  return {
    type: 'nodeSequencer:Listener',
    sound: randomChoice(SOUNDS),
    x: randomInt(500),
    y: randomInt(500)
  };
}

function randomElements() {
  return [
    randomRoot(),
    ...randomEmitters(),
    ...randomListeners()
  ];
}

module.exports.randomSequence = function() {
  return {
    elements: randomElements()
  };
};

module.exports.sequenceToUrl = function(sequence) {
  return new Promise((resolve, reject) => {
    zlib.deflate(JSON.stringify(sequence), (err, buffer) => {
      if (!err) {
        resolve(BASE_URL + buffer.toString('base64'));
      } else {
        reject(err);
      }
    });
  });
};
