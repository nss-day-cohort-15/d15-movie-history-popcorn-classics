"use strict";
var $ = require('../bower_components/jquery/dist/jquery.min.js')

function addToDom(data){
  for(var i =0; i < 3; i++){
  var title = `<h4 class='movie_title'>${data.Search[i].Title}</h2>`
  var poster = `<img src='${data.Search[i].Poster}' class='poster'>`
  var year = `<p class='year'>Release Year: ${data.Search[i].Year}</p>`

  var movie = `<div class='movie'>${title}${poster}${year}</div>`
  $('#homemovies').append(movie)
}
}

module.exports = {addToDom}
