"use strict";

// http:www.omdbapi.com/?s=Captain+America&r=json
var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    login = require('./user'),
    logOutGoogle = require('./logOut'),
    userid,
    deleteKeys = []

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
// ///////////////END AFTER LOGIN SPA EVENTS/////////////////////

//GOOGLE LOGIN
$(document).on('click', '#login', function(){
  console.log("clicked auth")
  login()
  .then(function(result){
    let user = result.user
    console.log(user.uid)
    userid = user.uid
    $('.loginPage').hide()
    $('.afterLogin').show()
    $('#unwatched').show()
    $('#watched').show()
    $('#favorite').show()
    $('.login').html('Logout')
    $('.login').attr('id', 'logout')

    let loginToast = `<span><img class="login-img"
      src="${user.photoURL}"><h6>${user.displayName}
      successfully logged in!</h6></span>`
    Materialize.toast(loginToast, 4000)

    $(document).on('click', '#logout', function(){
      console.log('logout')
      let logoutToast = `<span><img class="login-img"
        src="${user.photoURL}"><h6>${user.displayName}
        successfully logged out!</h6></span>`
      Materialize.toast(logoutToast, 2000)
      logOutGoogle()
      setTimeout(function(){
        window.location.reload()
      }, 2000);
    })
  })
    api.loadAllMovies()
      .then(function(data){
        console.log('DATA', data)
          var idArr = Object.keys(data)
          idArr.forEach(function(key){
            data[key].id = key
          })
        deleteKeys = idArr
        dom.addYoursToDom(data, deleteKeys)
      })
});

$('#movieSearch').keypress(function(e) {
  if(e.which == 13) {
    $('div#homemovies').html("")
    $('#homemovies').show()
    $('#watchedmovies, #unwatchedmovies, #fave').hide()
    $('#home').addClass('active')
    $('#watched, #unwatched, #favorite').removeClass('active')
    $('#crumbs').html('Home')

    var input = $('#movieSearch').val()
    api.searchMovie(convertString(input))
      .then(function(data){
        dom.addSearchToDom(data)
      })
  }
});

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

$(document).on('click', '.delete', function(){
  $(this).parent().remove()
  let movieId = $(this).closest('.movie').attr('id')
  api.deleteMovie(movieId)
  Materialize.toast('Movie deleted!', 4000)
})
// ADDS MOVIE TO UNWATCHED LIST WHEN CLICKED
$(document).on('click', '.add', function(){
  let title = $(this).parent().parent().children('.movie_title').text()
  let src = $(this).parent().parent().children('.poster').attr('src')
  let year = $(this).parent().parent().children('.year').text()
  $(this).closest('.movie').remove()

  //PROMISE TO ADD TO FIREBASE UNWATCHED MOVIES TABLE GOES HERE
  if(userid){
    Materialize.toast('Movie added to unwatched list!', 4000)
    api.addMovie(buildObject(title, src, year, false, 0))
      .then(function(movie){
        api.loadAllMovies()
      .then(function(movie){
        var idArr = Object.keys(movie)
        idArr.forEach(function(key){
          movie[key].id = key
          deleteKeys = idArr
        })
          dom.addYoursToDom(movie, deleteKeys)
      })
    })
  }
  else{
    console.log('You cant add movies')
    Materialize.toast('You must sign in to add movies!', 4000)
  }
})

/////////////////////////////////////////////////////////////////
//ADDS MOVIE TO WATCHED LIST WHEN CLICKED
$(document).on('click', ".save", function(){
  if($('#unwatched').hasClass('active')){
    Materialize.toast('Movie added to watched list!', 4000)
  }
  else{
    Materialize.toast('Your rating was saved!', 4000)
  }
  $(this).closest('.movie').remove()

  var cardId = $(this).closest('.movie').attr('id')
  var rating = $(this).closest('.movie').children('.ratings').children('.rating').val()
  var title = $(this).closest('.movie').children('.movie_title').text()
  var src = $(this).closest('.movie').children('.poster').attr('src')
  var year = $(this).closest('.movie').children('.year').text()

  api.deleteMovie(cardId)
    .then(function(data){
      console.log('deleted')
      api.addMovie(buildObject(title, src, year, true, rating))
      .then(function(movie){
        api.loadAllMovies()
          .then(function(movie){
            var idArr = Object.keys(movie)
            idArr.forEach(function(key){
              movie[key].id = key
              deleteKeys = idArr
              console.log(userid)
            })
              dom.addYoursToDom(movie, idArr)
        })
      })
    })
})

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}
