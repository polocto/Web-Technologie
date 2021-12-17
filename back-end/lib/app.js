
const db = require('./db');
const express = require('express');
const cors = require('cors');
const {clone, merge} = require('mixme');
const microtime = require('microtime');
const authenticator = require('./authenticator');
const channels = require('./channels');
const users = require('./users');

const app = express();
const authenticate = authenticator({
  test_payload_email: process.env['TEST_PAYLOAD_EMAIL'],
  jwks_uri: 'http://127.0.0.1:5556/dex/keys'
});

app.use(require('body-parser').json());
app.use(cors());

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE WebTech Chat</h1>'
  ].join(''));
});

// Channels
app.use('/channels', authenticate, channels);

// Users
app.use('/users',authenticate,users);


module.exports = app
