"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json

var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    login = require('./user'),
    userid = ""

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
    console.log(user.uid);
    userid = user.uid;
    $('.loginPage').hide();
    $('.afterLogin').show();
    $('#unwatched').show()
    $('#watched').show()
    $('#favorite').show()
    // var token = result.credential.accessToken;
    })
    .then(function(info){
      api.loadAllMovies()
      .then(function(data){
        dom.addYoursToDom(data)
  })
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
          if(userid){
            api.loadAllMovies()
          }
        }).then(function(data){
          dom.addYoursToDom(data)
        })
  }
});

//////////////
// USED TO PASS AN OBJECT INTO ADD SONG FIREBASE FUNCTION
function buildObject(t, p, y, w, r){
  let songObj = {
    title: t,
    poster: p,
    year: y,
    rating: r,
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

// var rate = `<div class='ratings' id='ratings'><input class='rating' id='rating'
//   type='range' step='.5' value='0' min='0' max='10'><span class='r_value'>0</span></div>`


// ADDS MOVIE TO UNWATCHED LIST WHEN CLICKED
$(document).on('click', '.add', function(e){
  let title = $(this).parent().parent().children('.movie_title').text()
  let src = $(this).parent().parent().children('.poster').attr('src')
  let year = $(this).parent().parent().children('.year').text()
  $(this).closest('.movie').remove()

  //PROMISE TO ADD TO FIREBASE UNWATCHED MOVIES TABLE GOES HERE
  if(userid){
    Materialize.toast('Movie added to unwatched list!', 4000)
    api.addMovie(buildObject(title, src, year, false, 0))
      .then(function(movie){
        $('#unwatchedmovies').html("")
        api.loadAllMovies()
      .then(function(movie){
        dom.addYoursToDom(movie)
      })
    })
  }
  else{
    console.log('You cant add movies')
    Materialize.toast('You must sign in to add movies!', 4000)
  }
})

/////////////////////////////////////////////////////////////////
    // ADDS MOVIE TO WATCHED LIST WHEN CLICKED
$(document).on('click', ".save", function(){

  Materialize.toast('Movie added to watched list!', 4000)
  $(this).closest('.movie').remove()

  var rating = $(this).closest('.movie').children('.ratings').children('.rating').val()
  var title = $(this).closest('.movie').children('.movie_title').text()
  var src = $(this).closest('.movie').children('.poster').attr('src')
  var year = $(this).closest('.movie').children('.year').text()

  api.addMovie(buildObject(title, src, year, true, rating))
    .then(function(movie){
      $('#unwatchedmovies').html("")
      $('#watchedmovies').html("")
      api.loadAllMovies()
      .then(function(movie){
        dom.addYoursToDom(movie)
      })
    })
})
//MOVIE SEARCH PROMISE

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}
