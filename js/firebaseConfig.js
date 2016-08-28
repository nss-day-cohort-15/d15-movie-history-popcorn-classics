"use strict"

let firebase = require('firebase/app'),
    fb = require('./fb-getter')

require('firebase/auth')

var config = {
  apiKey: fb.key,
  authDomain: fb.authUrl
}

firebase.initializeApp(config)

module.exports = firebase
