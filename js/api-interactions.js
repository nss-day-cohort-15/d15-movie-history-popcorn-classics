"use strict"
console.log("ALIVE")
let $ = require('../bower_components/jquery/dist/jquery.min.js'),
   firebase = require("./firebaseConfig");

  let searchMovie = function(title) {
    return new Promise(function(resolve, reject){
      title = $(".movieSearch").val();
    $.ajax({
        url: `http://www.omdbapi.com/?t=${title}&y=&plot=short&r=json`
    }).done(function(data){
      let movieData = [data.Title, data.Year, data.Actors]
        resolve(movieData)
        console.log(movieData);
      }).fail(function(error){
        reject(error);
        });
    });//end of promise;
  };

// API TEST TO PROVE CORRECT CONFIGURATION
function addUnwatchedMovie(obj){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/unwatched.json',
      type: 'POST',
      data: JSON.stringify(obj),
      dataType: 'json'
    }).done(function(songId){
      resolve(songId)
    })
  })
}

function addWatchedMovie(obj){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: 'https://popcorn-classics.firebaseio.com/watched.json',
      type: 'POST',
      data: JSON.stringify(obj),
      dataType: 'json'
    }).done(function(songId){
      resolve(songId)
    })
  })
}

// let searchMovie = function(title) {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: `http://www.omdbapi.com/?s=${title}&r=json`
//       // url: `http://www.omdbapi.com/?t=snatch&y=&plot=short&r=json`
//     }).done(function(data){
//         resolve(data)
//         console.log(data);
//       }).fail(function(error){
//         reject(error);
//         });
//   });//end of promise;
// };
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

  module.exports = {searchMovie, addUnwatchedMovie, addWatchedMovie, deleteMovie};
