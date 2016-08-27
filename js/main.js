"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json

var $ = require('../bower_components/jquery/dist/jquery.min.js')
var dom =require('./dom-builder')

// TEST MOVIE OBJECT
var data = {
  "Search": [
    {
      "Title": "Captain America: The First Avenger",
      "Year": "2011",
      "imdbID": "tt0458339",
      "Type": "movie",
      "Poster": "http://cdn.playbuzz.com/cdn/8ace370e-0453-4890-8fea-995f32ac9530/5efa0fd9-4850-47d4-814b-af367ab3f973.jpg"
    },
    {
      "Title": "Captain America: The Winter Soldier",
      "Year": "2014",
      "imdbID": "tt1843866",
      "Type": "movie",
      "Poster": "http://deeragaming.net/wp-content/uploads/2014/03/Bucky-Barnes-winter-soldier-image-bucky-barnes-winter-soldier-36483025-1200-1800.png"
    },
    {
      "Title": "Captain America: Civil War",
      "Year": "2016",
      "imdbID": "tt3498820",
      "Type": "movie",
      "Poster": "https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg"
    }
  ]
}

// HOME LOGIN AREA EVENTS
$('#google_login').hide()
$('.loginPage').hide()

$('#google').on('click', function(){
  $('#google_login').show()
  $('#login_info').hide()
})

$('#email').on('click', function(){
  $('#login_info').show()
  $('#google_login').hide()
})

// AFTER LOGIN SPA PAGE EVENTS
$('#watchedmovies').hide()
$('#unwatchedmovies').hide()

$('#home').on('click', function(){
  $('#homemovies').show()
  $('#watchedmovies').hide()
  $('#unwatchedmovies').hide()

  $('#home').addClass('active')
  $('#watched, #unwatched').removeClass('active')
})

$('#watched').on('click', function(){
  $('#watchedmovies').show()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()

  $('#watched').addClass('active')
  $('#home, #unwatched').removeClass('active')
})

$('#unwatched').on('click', function(){
  $('#unwatchedmovies').show()
  $('#watchedmovies').hide()
  $('#homemovies').hide()

  $('#unwatched').addClass('active')
  $('#watched, #home').removeClass('active')
})

dom.addToDom(data)
