"use strict";
var $ = require('../bower_components/jquery/dist/jquery.min.js')

function addSearchToDom(data){
  //USED TO PREVENT APP BREAK WHEN RESULTS RETURNED IS
  // LESS THAN 3 BY CHECKOUT RESPONSE AND TOTALRESULTS
  var times
  if(data.Response !== 'False'){
    if(data.totalResults < 9){
      times = data.totalResults
    }
    else if(data.totalResults === 0){
      Materialize.toast('Movie not found!', 4000)
    }
    else{
      times = 9
    }

    for(var i =0; i < times; i++){
      var poster
      var movie = $(`<div class='movie'></div>`)
      var title = `<h5 class='movie_title'>${data.Search[i].Title}</h2>`
      //IF POSTER PICTURE IS NOT FOUND ADDS AN
      //'IMG NOT FOUND' PICTURE INSTEAD OF A BROKEN
      //PICTURE IMAGE
      if(data.Search[i].Poster === "N/A"){
        poster = `<img src='../img/imgNotfound.jpg' class='poster'>`
      }
      else{
        poster = `<img src='${data.Search[i].Poster}' class='poster'>`
      }
      var year = `<p class='year'>Release Year: ${data.Search[i].Year}</p>`
      var add = `<p><a href='#' class='add' id='add'>Add to watchlist</a></p>`

      movie.append(title + poster + year + add)
      $('#homemovies').append(movie)
    }
  }
}

function addYoursToDom(data, id, uid){
  $('div#unwatchedmovies').html("")
  $('div#watchedmovies').html("")
  //USED TO INCREMENT OVER DELETE KEYS
  var i = 0
  ///////////////////
  for(var key in data){
    if(data[key].userid === uid){
      var your_movie = $(`<div class='movie' id='${id[i]}'></div`)
      var destroy = `<span class='delete glyphicon glyphicon-remove'></span>`
      var title = `<h5 class='movie_title'>${data[key].title}</h2>`
      var poster = `<img src='${data[key].poster}' class='poster'>`
      var year = `<p class='year'>${data[key].year}</p>`
      var rate = `<div class='ratings' id='ratings'><input class='rating' id='rating'
        type='range' step='.5' value='${data[key].rating}' min='0' max='10'><span class='r_value'>${data[key].rating}</span></div>`
      var add = `<p><a href='#' class='save' id='save'>Save Rating</a></p>`

      your_movie.append(destroy + title + poster + year + rate + add)
      //DETERMINES WHERE EACH MOVIE SHOULD BE PLACED
      //BASE ON 'WATCHED' VALUE
      if(data[key].watched === false){
        $('#unwatchedmovies').append(your_movie)
        console.log('unwatched')
      }
      else if(data[key].watched === true){
        $('#watchedmovies').append(your_movie)
        console.log('watched')
      }
    }
    i++
  }
  //EVENT FOR INDIVIDUAL RATING INPUT
  $('.ratings').on('input', function(){
    $(this).children('.r_value').html($('#rating', this).val())
  })

}

module.exports = {addSearchToDom, addYoursToDom}
