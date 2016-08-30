"use strict";
var $ = require('../bower_components/jquery/dist/jquery.min.js')
    // Handlebars = require('/hbsfy/runtime'),
    // entryTemplate = require('../templates/article.hbs')
    // entryData = require('../templates/data.js')

function addToDom(data){
  console.log(data)
  var times
  if(data.totalResults < 9){
    times = data.totalResults
  }
  else{
    times = 9
  }

  for(var i =0; i < times; i++){
    var title = `<h5 class='movie_title'>${data.Search[i].Title}</h2>`
    var poster = `<img src='${data.Search[i].Poster}' class='poster'>`
    var year = `<p class='year'>Release Year: ${data.Search[i].Year}</p>`
    var add = `<p><a href='#' class='add' id='add'>Add to watchlist</a></p>`
    var movie = `<div class='movie'>${title}${poster}${year}${add}</div>`
    $('#homemovies').append(movie)
  // $('#homemovies').append(entryTemplate(entryData))
  }
}

module.exports = {addToDom};