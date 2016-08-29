"use strict";
let firebase = require("./firebaseConfig"),
    provider = new firebase.auth.GoogleAuthProvider();

    // credential = firebase.auth.EmailPasswordAuthProvider();


// function newUser() {
//   var email = $('#email').val()
//   var password = $('#password').val();
//   return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorMessage);
//   })
// }
function logInGoogle() {
  console.log('log in google running')
  return firebase.auth().signInWithPopup(provider)

}

// function loginUser() {
//   // var email = $('#email').val()
//   // console.log(email);
//   // var password = $('#password').val();
//   // console.log(password);
//   return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorMessage);
//   })
// }




module.exports = loginUser;



