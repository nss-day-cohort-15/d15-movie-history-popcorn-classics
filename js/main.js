"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json

var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    userid
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
/* USE TO TOGGLE VIEWS BETWEEN PAGES WHILE TESTING
    UNCOMMENT ONE TO SEE THE OTHER
    EX: COMMENT OUT $('.LOGINPAGE') AND UNCOMMENT
    AFTERLOGIN TO SEE AFTER LOGIN*/
$('.loginPage').hide()
// $('.afterLogin').hide()
///////////////////////////////////////////////////

// HOME LOGIN AREA SPA EVENTS ////////////////
$('#google_login').hide()

$('#google').on('click', function(){
  $('#google_login').show()
  $('#login_info').hide()
})

$('#email').on('click', function(){
  $('#login_info').show()
  $('#google_login').hide()
})
/////////////////////////////////////////
// AFTER LOGIN SPA PAGE EVENTS
$('#watchedmovies').hide()
$('#unwatchedmovies').hide()

$('#home').on('click', function(){
  $('#homemovies').show()
  $('#watchedmovies').hide()
  $('#unwatchedmovies').hide()

  $('#home').addClass('active')
  $('#watched, #unwatched').removeClass('active')
  $('.instruction').text('Click on a movie to add it to your unwatched list!')
})

$('#unwatched').on('click', function(){
  $('#unwatchedmovies').show()
  $('#watchedmovies').hide()
  $('#homemovies').hide()

  $('#unwatched').addClass('active')
  $('#watched, #home').removeClass('active')
  $('.instruction').text('Click a movie to add it to your watched list!')
})

$('#watched').on('click', function(){
  $('#watchedmovies').show()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()

  $('#watched').addClass('active')
  $('#home, #unwatched').removeClass('active')
})
/////////////////////////////////////////////////////
// ADDS MOVIES TO DOM
dom.addToDom(data)

function options(){
  var destroy = `<span class='delete glyphicon glyphicon-remove'></span>`
  return destroy
}
// ADDS MOVIE TO UNWATCHED LIST WHEN CLICKED
$('.movie').on('click', function(){
  $(this).remove()
  $(this).removeClass('movie')
  $(this).addClass('newUnwatched')
  $(this).prepend(options())

  $('#unwatchedmovies').append(this)

  $('.delete').on('click', function(){
    $(this).parent().remove()
      // Materialize.toast('Movie added to unwatched list!', 4000)
  })
  // CREATES OBJECT BASED ON THE MOVIE CLICKED
  var title = $(this).children('.movie_title').text()
  var poster = $(this).children('.poster').attr('src')
  var year = $(this).children('.year').text()
  buildObject(title, poster, year)
  // api.addUnwatchedMovie(buildObject())
})
  ///////////////////////////////////////////////
    // ADDS MOVIE TO WATCHED LIST WHEN CLICKED
$('.unwatchedmovies').on('click', "div", function(){
  $(this).addClass('newWatched')
  $(this).removeClass('newUnwatched')
  var x = `<input class='rating' id='rating'
    type='range' step='.5' value='0' min='0' max='5'><span class='r_value'>0</span>`
  // Materialize.toast('Movie added to watched list!', 4000)
  $(this).append(x)
  $('#watchedmovies').append(this)
    //APPENDS MOVIE FROM UNWATCHED LIST TO WATCH LIST ON CLICK

  $('.delete').on('click', function(){
    $(this).parent().remove()
  })
  //USED FOR RATING VALUE
  $('#rating').on('input', function(){
    $('.r_value').html($('#rating').val())
  })
})

function buildObject(t, p, y){
  var songObj = {
    title: t,
    poster: p,
    year: y,
    rating: "",
    userid: userid
  }
  console.log(songObj)
  return songObj
}

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}
