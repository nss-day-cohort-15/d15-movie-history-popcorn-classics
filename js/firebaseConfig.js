"use strict"

let firebase = require('../lib/node_modules/firebase/app'),
    fb = require('./fb-getter')

require('../lib/node_modules/firebase/auth')

var config = {
  apiKey: fb.key,
  authDomain: fb.authUrl
}

firebase.initializeApp(config)

module.exports = firebase
