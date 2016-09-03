"use strict";
var $ = require('../bower_components/jquery/dist/jquery.min.js')

function addSearchToDom(data){
  //USED TO PREVENT APP BREAK WHEN RESULTS RETURNED IS
  // LESS THAN 3
  var times
  if(data.totalResults < 6){
    times = data.totalResults
  }
  else{
    times = 6
  }

  for(var i =0; i < times; i++){
    var movie = $(`<div class='movie'></div>`)
    var title = `<h5 class='movie_title'>${data.Search[i].Title}</h2>`
    var poster = `<img src='${data.Search[i].Poster}' class='poster'>`
    var year = `<p class='year'>Release Year: ${data.Search[i].Year}</p>`
    var add = `<p><a href='#' class='add' id='add'>Add to watchlist</a></p>`

    movie.append(title + poster + year + add)
    $('#homemovies').append(movie)
  }
}

function addYoursToDom(data){
 for(var key in data){
    var destroy = `<span class='delete glyphicon glyphicon-remove'></span>`
    var title = `<h5 class='movie_title'>${data[key].title}</h2>`
    var poster = `<img src='${data[key].poster}' class='poster'>`
    var year = `<p class='year'>${data[key].year}</p>`
    var rate = `<div class='ratings' id='ratings'><input class='rating' id='rating'
    type='range' step='.5' value='0' min='0' max='10'><span class='r_value'>0</span></div>`
    var add = `<p><a href='#' class='save' id='save'>Save Rating</a></p>`


    var movie = `<div class='movie'>${destroy}${title}${poster}${year}${rate}${add}</div>`
    // $('#homemovies').append(movie)

    console.log(data, data[key])

  if(data[key].watched === false && data[key].rating < 1){
    $('#unwatchedmovies').append(movie)
    console.log('unwatched')
  }
  else if(data[key].watched === true || data[key].rating > 0){
    $('#watchedmovies').append(movie)
    console.log('watched')
  }
 }
  $('.delete').on('click', function(){
    $(this).parent().remove()
  })

  $('.ratings').on('input', function(){
    $(this).children('.r_value').html($('#rating', this).val())
  })
}

module.exports = {addSearchToDom, addYoursToDom}
