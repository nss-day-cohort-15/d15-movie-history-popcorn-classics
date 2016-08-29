"use strict";
var $ = require('../bower_components/jquery/dist/jquery.min.js')
    // Handlebars = require('/hbsfy/runtime'),
    // entryTemplate = require('../templates/article.hbs')
    // entryData = require('../templates/data.js')

function addToDom(data){
  //USED TO PREVENT APP BREAK WHEN RESULTS RETURNED IS
  // LESS THAN 3
  var times
  if(data.totalResults < 3){
    times = data.totalResults
  }
  else{
    times = 3
  }

  for(var i =0; i < times; i++){
    console.log(data)
    var title = `<h5 class='movie_title'>${data.Search[i].Title}</h2>`
    var poster = `<img src='${data.Search[i].Poster}' class='poster'>`
    var year = `<p class='year'>Release Year: ${data.Search[i].Year}</p>`

    var movie = `<div class='movie'>${title}${poster}${year}</div>`
    $('#homemovies').append(movie)
  // $('#homemovies').append(entryTemplate(entryData))
  }
}

module.exports = {addToDom}
