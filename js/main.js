"use strict";

var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    dom =require('./dom-builder'),
    api = require('./api-interactions'),
    login = require('./user'),
    logOutGoogle = require('./logOut'),
    userid,
    deleteKeys = []
//////////////////////////////////////////////
/////////HOME LOGIN AREA SPA EVENTS //////////
//////////////////////////////////////////////
$('#google_login').hide()
$('#rval, #range, #r_label').hide()

$('#google').on('click', function(){
  $('#google_login').show()
  $('#login_info').hide()
})

$('#email').on('click', function(){
  $('#login_info').show()
  $('#google_login').hide()
})
//////////////////////////////////////////////
/////////AFTER LOGIN SPA PAGE EVENTS//////////
//////////////////////////////////////////////
$('#watchedmovies').hide()
$('#unwatchedmovies').hide()
$('#unwatched').hide()
$('#watched').hide()

$('#home').on('click', function(){
  $('#homemovies').show()
  $('#watchedmovies').hide()
  $('#unwatchedmovies').hide()

  $('#crumbs').html('Home')
  $('#home').addClass('active')
  $('#watched, #unwatched').removeClass('active')
})

$('#unwatched').on('click', function(){
  $('#unwatchedmovies').show()
  $('#watchedmovies').hide()
  $('#homemovies').hide()

  $('#crumbs').html('Unwatched')
  $('#unwatched').addClass('active')
  $('#watched, #home').removeClass('active')
})

$('#watched').on('click', function(){
  $('#watchedmovies').show()
  $('#homemovies').hide()
  $('#unwatchedmovies').hide()

  $('#crumbs').html('Watched')
  $('#watched').addClass('active')
  $('#home, #unwatched').removeClass('active')
})

/////////END AFTER LOGIN SPA EVENTS/////////
/////////////////////////////////////
/////////GOOGLE LOGIN//////////
$(document).on('click', '#login', function(){
  console.log("clicked auth")
  login()
  .then(function(result){
    let user = result.user
    console.log(user.uid)
    userid = user.uid
    $('.loginPage').hide()
    $('.afterLogin, #unwatched, #watched').show()
    $('.login').html('Logout')
    $('.login').attr('id', 'logout')
    $('#rval, #range, #r_label').show()

    let loginToast = `<span><img class="login-img"
      src="${user.photoURL}"><h6>${user.displayName}
      successfully logged in!</h6></span>`
    Materialize.toast(loginToast, 4000)
    // USED FOR LOGGING OUT
    $(document).on('click', '#logout', function(){
      console.log('logout')
      let logoutToast = `<span><img class="login-img"
        src="${user.photoURL}"><h6>${user.displayName}
        successfully logged out!</h6></span>`
      Materialize.toast(logoutToast, 2000)
      logOutGoogle()
      //RELOADS PAGE AFTER TIME OUT FOR BETTER UI
      setTimeout(function(){
        window.location.reload()
      }, 2000);
    })
    //AFTER USER LOGS IN, LOAD ALL MOVIES AND ADD DELETE
    //KEY ON MOVIE DIV FOR FUTURE DELETION
    api.loadAllMovies()
      .then(function(data){
        console.log('DATA', data)
          var idArr = Object.keys(data)
          idArr.forEach(function(key){
            data[key].id = key
          })
        deleteKeys = idArr
        dom.addYoursToDom(data, deleteKeys, userid)
      })
    })
});

// MOVES CURRENT NAV AND DIV TO WATCHED MOVIES TAB
// LOADS ALL MOVIES AND FILTERS BASED ON RANGE
// INPUT RATING
$(document).on('input', '#range', function(){
  $('#rval').html($('#range').val())
  $('#unwatchedmovies, #homemovies').hide()
  $('#watchedmovies').show()
  $('#home, #unwatched').removeClass('active')
  $('#watched').addClass('active')
  var movieObj = {}

  api.loadAllMovies()
    .then(function(movies){
      $('#watchedmovies').html("")
      var val = $('#range').val()
      let idArr = Object.keys(movies)
      idArr.forEach(function(item){
        movies[item].id = item
      })
      let deleteKeys = idArr
      for(var key in movies){
        if(movies[key].rating >= val){
          console.log(val, movies[key].rating)
          movieObj[key] = movies[key]
          dom.addYoursToDom(movieObj, deleteKeys, userid)
        }
      }
    })
})

//SEARCH'S OMDB DATABASE ON EACH TEXT INPUT
$('#movieSearch').on('input', function(){
    $('div#homemovies').html("")
    $('#homemovies').show()
    $('#watchedmovies, #unwatchedmovies').hide()
    $('#home').addClass('active')
    $('#watched, #unwatched').removeClass('active')
    $('#crumbs').html('Home')

    var input = $('#movieSearch').val()
    api.searchMovie(convertString(input))
      .then(function(data){
        dom.addSearchToDom(data)
      })
})

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
  return songObj
}
//DELETES MOVIE WHEN 'X' IS CLICKED
$(document).on('click', '.delete', function(){
  $(this).parent().remove()
  let title = $(this).parent().children('.movie_title').text()
  let movieId = $(this).closest('.movie').attr('id')
  api.deleteMovie(movieId)
  if(title === 'Gladiator'){
    Materialize.toast(`ARE YOU NOT ENTERTAINED?!`, 4000)
  }
  else{
    Materialize.toast(`${title} was deleted!`, 4000)
  }
})
// ADDS MOVIE TO UNWATCHED LIST WHEN CLICKED
$(document).on('click', '.add', function(){
  let title = $(this).parent().parent().children('.movie_title').text()
  let src = $(this).parent().parent().children('.poster').attr('src')
  let year = $(this).parent().parent().children('.year').text()

  //IF USER IS SIGNED IN, ADD MOVIE TO FIREBASE,
  //THEN RELOAD ALL USER MOVIES AND ASSIGN FIREBASE
  //KEY TO EACH MOVIE CARD FOR LATER DELETION
  //THEN ADD TO DOM
  if(userid){
    $(this).closest('.movie').remove()
    Materialize.toast(`${title}, was added to your unwatched list!`, 4000)
    api.addMovie(buildObject(title, src, year, false, 0))
      .then(function(movie){
        api.loadAllMovies()
      .then(function(movie){
        var idArr = Object.keys(movie)
        idArr.forEach(function(key){
          movie[key].id = key
          deleteKeys = idArr
        })
          dom.addYoursToDom(movie, deleteKeys, userid)
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
  var cardId = $(this).closest('.movie').attr('id')
  var rating = $(this).closest('.movie').children('.ratings').children('.rating').val()
  var title = $(this).closest('.movie').children('.movie_title').text()
  var src = $(this).closest('.movie').children('.poster').attr('src')
  var year = $(this).closest('.movie').children('.year').text()
  //DETERMINES TOAST MEASSAGE BASE ON ACTIVE NAV TAB
  if($('#unwatched').hasClass('active')){
    Materialize.toast(`${title} was added to your watched list, with a rating of ${rating}`, 4000)
  }
  else{
    Materialize.toast('Your rating was saved!', 4000)
  }
  $(this).closest('.movie').remove()

  //DELETES MOVIE FROM UNWATCHED LIST, SETS 'WATCHED'
  //VALUE TO TRUE, THEN ADDS KEY TO MOVIE DIV FOR LATER
  //DELETION, THEN RELOADS ALL MOVIES AND PLACES EACH
  //MOVIE ACCORDING TO THEIR 'WATCHED' VALUE
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
            dom.addYoursToDom(movie, idArr, userid)
        })
      })
    })
})

// CONVERTS MOVIE USER INPUT STRING TO A URL USEABLE ONE
function convertString(string){
    var replaced = string.split(' ').join('+').toLowerCase()
    return replaced
}
