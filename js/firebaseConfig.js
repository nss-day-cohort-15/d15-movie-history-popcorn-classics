"use strict"

let firebase = require('../lib/node_modules/firebase/app'),
    fb = require('./fb-getter'),
    fbData = fb();

require('../lib/node_modules/firebase/auth')

var config = {
  apiKey: fbData.key,
  authDomain: fbData.authUrl
}

firebase.initializeApp(config);

console.log(firebase);

module.exports = firebase;
