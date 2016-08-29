"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json

var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    login = require('./user'),
    logOutGoogle = require('./user'),
    logInEmail = require('./user'),
    newEmailUser = require('./user'),
    userid = "";

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
// $('.loginPage').hide()
$('.afterLogin').hide()
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
  $('.instruction').text('Click on a movie to save it to your unwatched list!')
})

$('#unwatched').on('click', function(){
  $('#unwatchedmovies').show()
  $('#watchedmovies').hide()
  $('#homemovies').hide()

  $('#unwatched').addClass('active')
  $('#watched, #home').removeClass('active')
  $('.instruction').text('Click a movie to save it to your watched list!')
})

$('#watched').on('click', function(){
  $('#watchedmovies').show()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()

  $('#watched').addClass('active')
  $('#home, #unwatched').removeClass('active')
})
//GOOGLE LOGIN
$("#google_login").on('click', function() {
  console.log("clicked auth");
  login()
  .then(function(result){
    let user = result.user;
    console.log('USER ID IS THIS LONG THING', user.uid);
    userid = user.uid;
    $('.loginPage').hide();
    $('.afterLogin').show();
    // var token = result.credential.accessToken;
  })
});
 // GOOGLE LOGOUT
$('#logout').on('click', function(){
  logOutGoogle()
  console.log('user has logged out')
})

// EMAIL SIGNUP
$('#register').on('click', function(){
  newEmailUser()
  .then(function(result){
    let user = result.user;
    console.log('USER ID IS THIS LONG THING', user.uid);
    userid = user.uid;
    $('.loginPage').hide();
    $('.afterLogin').show();
  })
})

// RETURNING USER LOGIN
$('#submit_login').on('click', function(){
  logInEmail()
  .then(function(result){
    let user = result.user;
    console.log('USER ID IS THIS LONG THING', user.uid);
    userid = user.uid;
    $('.loginPage').hide();
    $('.afterLogin').show();
  })
})
/////////////////////////////////////////////////////
// ADDS MOVIES TO DOM
dom.addToDom(data)

//PROMISE TO ADD SEARCH RESULTS TO DOM POSSIBLY GOES HERE?

//////////////
// USED TO PASS AN OBJECT INTO ADD SONG FIREBASE FUNCTION
function buildObject(t, p, y){
  let songObj = {
    title: t,
    poster: p,
    year: y,
    rating: "",
    uid: userid
  }
  console.log(songObj)
  return songObj
}
// CREATES DELETE BUTTON
function options(){
  var destroy = `<span class='delete glyphicon glyphicon-remove'></span>`
  return destroy
}
// ADDS MOVIE TO UNWATCHED LIST WHEN CLICKED
function movieEvents(){
  $('.movie').on('click', function(){
    $(this).remove()
    $(this).removeClass('movie')
    $(this).addClass('newUnwatched')
    $(this).prepend(options())

    $('#unwatchedmovies').append(this)

    $('.delete').on('click', function(){
    // Materialize.toast('Movie added to unwatched list!', 4000)
    $(this).parent().remove()
    //DELETE ELEMENT FROM UNWATCHED FIREBASE LIST PROMISE
    // GOES HERE///////////////////////
  })
  // CREATES OBJECT BASED ON THE MOVIE CLICKED
    let title = $(this).children('.movie_title').text()
    let poster = $(this).children('.poster').attr('src')
    let year = $(this).children('.year').text()

    console.log(title, poster, year)
    //PROMISE TO ADD TO FIREBASE UNWATCHED MOVIES TABLE GOES HERE
    api.addUnwatchedMovie(buildObject(title, poster, year))
  })
}
  ///////////////////////////////////////////////
    // ADDS MOVIE TO WATCHED LIST WHEN CLICKED
$('.unwatchedmovies').on('click', "div", function(){
  $(this).addClass('newWatched')
  $(this).removeClass('newUnwatched')
  var rate = `<input class='rating' id='rating'
    type='range' step='.5' value='0' min='0' max='5'><span class='r_value'>0</span>`
  // Materialize.toast('Movie added to watched list!', 4000)
  $(this).append(rate)
    //APPENDS MOVIE FROM UNWATCHED LIST TO WATCH LIST ON CLICK
  $('#watchedmovies').append(this)

  //PROMISE TO ADD TO FIREBASE WATCHED MOVIES TABLE GOES HERE
/////////////////
  $('.delete').on('click', function(){
    $(this).parent().remove()
  //DELETE ELEMENT FROM WATCHED FIREBASE LIST PROMISE
    // GOES HERE
  })
  //USED FOR RATING VALUE
  $('#rating', this).on('input', function(){
    $(this).next().next().html($('#rating', this).children().context.value)
  })

  let title = $(this).find('.movie_title').text()
  let poster = $(this).find('.poster').attr('src')
  let year = $(this).find('.year').text()

  console.log(title, poster, year)
  api.addWatchedMovie(buildObject(title, poster, year))
})
//MOVIE SEARCH PROMISE
$('#movieSearch').keypress(function(e) {
  if(e.which == 13) {
    $('div#homemovies').html("")
    var input = $('#movieSearch').val()
    api.searchMovie(convertString(input))
      .then(function(data){
        dom.addToDom(data)
        movieEvents()
      })
  }
});

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}



movieEvents()

