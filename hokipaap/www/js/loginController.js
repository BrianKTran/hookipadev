angular.module('login', [])

.controller('loginCtrl', ['$scope', '$state', 'auth', 'store', function($scope, $state, auth, store){
  //firebase initialization and under that fbauth native firebase sdk
    var config = {
        apiKey: "AIzaSyBOV1HSFxqzLjlF7ueo1JFAfY_ZDaiXWFM",
        authDomain: "hookipafirebase.firebaseapp.com",
        databaseURL: "https://hookipafirebase.firebaseio.com",
        storageBucket: "hookipafirebase.appspot.com",
      };
    firebase.initializeApp(config);
  
  var provider = new firebase.auth.FacebookAuthProvider();
  // fbLogin function 
  this.fbLogin = function(){
    console.log('aqui chegou');
    firebase.auth().signInWithRedirect(provider);
    
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    
  };
  
}])
