"use strict";
let firebase = require("./firebaseConfig");

function logOutGoogle() {
   firebase.auth().signOut()

   .then(function() {
      console.log('Signout Succesful')
   }, function(error) {
      console.log('Signout Failed')
   });
}

module.exports = logOutGoogle;
