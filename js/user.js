"use strict";
let firebase = require("./firebaseConfig"),
    provider = new firebase.auth.GoogleAuthProvider(),
    email = $('#email').val(),
    password = $('#password').val();


function logInGoogle() {
  return firebase.auth().signInWithPopup(provider)

}


function logOutGoogle() {
   firebase.auth().signOut()

   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')
   });
}

function logInEmail() {
  firebase.auth().signInWithEmailAndPassword(email, password)

    .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

function newEmailUser(){
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}
module.exports = logInGoogle, logOutGoogle, logInEmail, newEmailUser;

