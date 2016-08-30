"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json

var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    login = require('./user'),
    userid = ""

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
$('#unwatched').hide()
$('#watched').hide()
$('#favorite').hide()

$('#home').on('click', function(){
  $('#homemovies').show()
  $('#watchedmovies').hide()
  $('#unwatchedmovies').hide()
  $('#fave').hide()

  $('#crumbs').html('Home')
  $('#home').addClass('active')
  $('#watched, #unwatched, #favorite').removeClass('active')
})

$('#unwatched').on('click', function(){
  $('#unwatchedmovies').show()
  $('#watchedmovies').hide()
  $('#homemovies').hide()
  $('#fave').hide()

  $('#crumbs').html('Unwatched')
  $('#unwatched').addClass('active')
  $('#watched, #home, #favorite').removeClass('active')
})

$('#watched').on('click', function(){
  $('#watchedmovies').show()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()
  $('#fave').hide()

  $('#crumbs').html('Watched')
  $('#watched').addClass('active')
  $('#home, #unwatched, #favorite').removeClass('active')
})

$('#favorite').on('click', function(){
  $('#watchedmovies').hide()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()
  $('#fave').show()

  $('#crumbs').html('Favorites')
  $('#favorite').addClass('active')
  $('#home, #unwatched, #watched').removeClass('active')
})

//GOOGLE LOGIN
$("#logout").on('click', function() {
  console.log("clicked auth");
  login()
  .then(function(result){
    let user = result.user;
    console.log('USER ID IS THIS LONG THING', user.uid);
    userid = user.uid;
    $('.loginPage').hide();
    $('.afterLogin').show();
    $('#unwatched').show()
    $('#watched').show()
    $('#favorite').show()
    // var token = result.credential.accessToken;
  })
});

$('#movieSearch').keypress(function(e) {
  if(e.which == 13) {
    $('div#homemovies').html("")
    var input = $('#movieSearch').val()
    api.searchMovie(convertString(input))
      .then(function(data){
        var idArr = Object.keys(data)
        idArr.forEach(function(key){
          while(idArr < idArr.length-1){
            data.Search[key].id = key
          }
        })
        dom.addSearchToDom(data)
        }).then(function(){
          api.loadAllMovies()
        }).then(function(data){
          dom.addYoursToDom(data)
        })
  }
});

  api.loadAllMovies()
    .then(function(data){
      dom.addYoursToDom(data)
  })

//PROMISE TO ADD SEARCH RESULTS TO DOM POSSIBLY GOES HERE?

//////////////
// USED TO PASS AN OBJECT INTO ADD SONG FIREBASE FUNCTION
function buildObject(t, p, y, w){
  let songObj = {
    title: t,
    poster: p,
    year: y,
    rating: "",
    watched: w,
    userid: userid
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
$('.homemovies').on('click', '.add', function(e){
  var jtarget = $(e.currentTarget).get(0)
  var tpar = $(jtarget).parent().get(0)
  $(this).remove()

  var rate = `<div class='ratings' id='ratings'><input class='rating' id='rating'
    type='range' step='.5' value='0' min='0' max='10'><span class='r_value'>0</span></div>`

  $(tpar).append(rate)

  $('.ratings').on('input', function(){
    $(this).children('.r_value').html($('#rating', this).val())
  })
  // Materialize.toast('Movie added to unwatched list!', 4000)
  // CREATES OBJECT BASED ON THE MOVIE CLICKED
  // let title = $(this).closest('.card').html()
  //HAVING PROBLEMS GRABBING ITEMS IN MOVIE DIV ON ADD TO WATCHLIST
  //CLICK. THIS IS A BAD WORK AROUND JUST FOR PRESENTATION
  $('.homemovies').on('click', '.movie', function(){
  $(this).addClass('newUnwatched')
    var title = $('.movie_title', this).text()
    let poster = $('.poster', this).attr('src')
    let year = $('.year', this).text()
      $(this).removeClass('movie')
    // console.log("here", title)
    // console.log("poster",poster)
    // console.log("year", year)
    //PROMISE TO ADD TO FIREBASE UNWATCHED MOVIES TABLE GOES HERE
    api.addMovie(buildObject(title, poster, year, false))
      .then(function(data){
        api.loadAllMovies()
      })
      .then(function(movie){
        dom.addYoursToDom(movie)
      }).then(function(){
        api.loadAllMovies()
        })
  })
})

/////////////////////////////////////////////////////////////////
    // ADDS MOVIE TO WATCHED LIST WHEN CLICKED
$('.unwatchedmovies').on('click', ".save", function(){

  // Materialize.toast('Movie added to watched list!', 4000)
  var bool = false
  if($('.rating').val() > 0){
    bool = true
  }

  let title = $(this).find('.title').text()
  let poster = $(this).find('.poster').attr('src')
  let year = $(this).find('.year').text()

  console.log("here", title, poster, year)

  api.addMovie(buildObject(title, poster, year, bool))
    .then(function(data){
      api.loadAllMovies()
    }).then(function(movie){
      dom.addYoursToDom(movie)
    }).then(function(){
      api.loadAllMovies()
    })
})
//MOVIE SEARCH PROMISE

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}
