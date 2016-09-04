"use strict"

// http:www.omdbapi.com/?s=Captain+America&r=json
var $ = require('../bower_components/jquery/dist/jquery.min.js'),
    firebase = require('./firebaseConfig')

// API TEST TO PROVE CORRECT CONFIGURATION
function addMovie(obj){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/movies.json',
      type: 'POST',
      data: JSON.stringify(obj),
      dataType: 'json'
    }).done(function(songId){
      resolve(songId)
    })
  })
}

function loadAllMovies(uid){
  return new Promise(function(resolve, reject){
    $.ajax({
    url: `https://popcorn-classics.firebaseio.com/movies.json`,
    type: 'GET',
    dataType: 'json'
    }).done(function(data){
        resolve(data)
      })
  })
}

let searchMovie = function(title) {
  return new Promise(function(resolve, reject){
    $.ajax({
      url: `http://www.omdbapi.com/?apikey=a2ace4c2&s=${title}&r=json`
    }).done(function(data){
        resolve(data)
        console.log(data);
      }).fail(function(error){
        reject(error);
        });
  });
};


let deleteMovie = function(movieId){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: `https://popcorn-classics.firebaseio.com/movies/${movieId}.json`, // this is the wrong url
      type: 'DELETE'
    }).done(function(movieData){
        resolve(movieData);
    }).fail(function(error){
      reject(error)
    });
  });
};

  module.exports = {searchMovie, loadAllMovies, addMovie, deleteMovie};
