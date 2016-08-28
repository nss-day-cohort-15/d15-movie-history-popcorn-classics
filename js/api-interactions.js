"use strict"
// https:popcorn-classics.firebaseio.com/
var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    firebase = require('./firebaseConfig')

function addUnwatchedMovie(obj){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/unwatched.json',
      type: 'POST',
      data: JSON.stringify(obj),
      dataType: 'json'
    }).done(function(songId){
      resolve(songId)
    })
  })
}

module.exports = {addUnwatchedMovie}
