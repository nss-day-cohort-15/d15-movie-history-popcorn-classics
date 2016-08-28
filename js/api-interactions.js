"use strict"
console.log("ALIVE")
let $ = require('../bower_components/jquery/dist/jquery.min.js'),
   firebase = require("./firebaseConfig");

  let searchMovie = function(title) {
    return new Promise(function(resolve, reject){
      title = $(".movieSearch").val();
    $.ajax({
        url: `http://www.omdbapi.com/?t=${title}&y=&plot=short&r=json`
        // url: `http://www.omdbapi.com/?t=snatch&y=&plot=short&r=json`
    }).done(function(data){
      let movieData = [data.Title, data.Year, data.Actors, data.Director]
        resolve(movieData)
        console.log(movieData);
      }).fail(function(error){
        reject(error);
        });
    });//end of promise;
  };

let addMovie = function(movieFormObject){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/movies/json', //this is not the right url
      type: 'POST',
      data: JSON.stringify(movieFormObject),
      dataType: 'json'
    }).done(function(movieId){
      resolve(movieId)
    }).fail(function(error){
      reject(error);
    });
  });
  };

let deleteMovie = function(movieId){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/movies/json', // this is the wrong url
      type: 'DELETE'
    }).done(function(movieData){
        resolve(movieData);
    }).fail(function(error){
      reject(error)
    });
  });
};

let editReview = function(movieFormObject, movieId){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/movies/json', //this is the wrong url
      type: 'PUT',
      data: JSON.stringify(movieFormObject)
    }).done(function(movieData){
      resolve(movieData)
    }).fail(function(error){
      reject(error)
    });
  });
};




  module.exports = {searchMovie, addMovie, deleteMovie, editReview};
