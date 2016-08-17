// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
  });
  
    var config = {
        apiKey: "AIzaSyBOV1HSFxqzLjlF7ueo1JFAfY_ZDaiXWFM",
        authDomain: "hookipafirebase.firebaseapp.com",
        databaseURL: "https://hookipafirebase.firebaseio.com",
        storageBucket: "hookipafirebase.appspot.com",
  };
  firebase.initializeApp(config);
  var database = firebase.database(); 
})


.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
  })
  .state('index', {
    url: '/',
    templateUrl: 'templates/main.html'
  })
   .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html'
  })
  .state('notification', {
    url: '/notification',
    templateUrl: 'templates/notify.html'
  })
  .state('editprofile', {
    url: '/editProfile',
    templateUrl: 'templates/editprofile.html'
  })
  .state('calendar', {
    url: '/calendar',
    templateUrl: 'templates/calendar.html'
  })
  .state('location', {
    url: '/location',
    templateUrl: 'templates/location.html'
  })
  .state('messages', {
    url: '/messages',
    templateUrl: 'templates/msg.html'
  })
  .state('paymentOptions', {
    url: '/payopt',
    templateUrl: 'templates/payopt.html'
  })
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/login.html'
  }) 
  .state('about', {
    url: '/about',
    templateUrl: 'templates/about.html'
  });
 
   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})



.controller('mainController', function($window, $state, $stateParams, $firebaseAuth){
  /*
  //hide menu on views enter
  $scope.$on('$ionicView.enter', function() {
    // code to run each time view is entered
  }); */
  
  var hari = this;
  hari.loggedIn = false;
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      hari.loggedIn = true; // no code can came before this statement
      $state.go('index');
      var uid= user.uid;
      var uid= user.uid
      hari.username= user.displayName;
      hari.email= user.email;
      hari.image= user.photoURL;
      console.log(user); // if user is sign in

      
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        if(snapshot=== "hare Krsna" ){
          var username = snapshot.val().username;
          if(snapshot.val().username){ // is user exists on databas
             console.log(username); 
          }else{
            console.log('user not in database'); 
            // if user not in database lets save him there
             firebase.database().ref('users/' + userId).set({
                username: hari.username,
                ocupation: "",
                phone: "",
                email: hari.email,
                address: "",
                picture: hari.image,
                rate: "not rated yet",
                menu: ""
                
              });
              console.log("user sent to database");
              }
        }
        // ...
      });
      // verify if user is already in the database
      // if user in the database do nothing, otherwise register his uid
    } else {
      // No user is signed in.
      console.log('Sorry darling, no user is signed in (logged). Try to log In');
      // rather to send user to login page :* 
      $timeout(function() { // angular is cute and weird at same time, timout is needed to $state.go to properly work
            $state.go('login');
      });
    }
  });
    
     

   this.profile = true;
   this.slogan="To feed is to love, GO Vegan";
   this.following= 108;
   this.followers= 254;
   this.rate = 4.8;
   this.active= true; // should be set to true if the user is in online mode.
   this.profission="Profissional Chef";
   this.phone="+1 98575108";
   this.address="521 King Street, Melbourne Australia";
   this.about=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere convallis urna id mollis. Maecenas justo tellus, tristique vel dignissim non";
   
   //finish of fake data for development
  this.resultado = $stateParams.result;
  
  
  
// function to Login the user 
  // facebook auth
  var provider = new firebase.auth.FacebookAuthProvider();
    // fbLogin function 
  this.fbLogin = function(){
      console.log('aqui chegou');
     
      firebase.auth().signInWithRedirect(provider);
      
      firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          console.log(result);
          // ...
        }
        
        // The signed-in user info.
        var user = result.user;
        console.log(user);
          $timeout(function() { // angular is cute and weird at same time, timout is needed to $state.go to properly work
            $state.go('index', {result: result});
          }); 
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
      
  };  // finish facebook auth 
  
  
  // function to logOut the user
 
  this.logOut = function(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
      
      console.log('deslogado');
      }, function(error) {
        // An error happened.
        console.log('Erro: ' + error);
      });
    };
 

})

/*
.controller('loginCtrl', ['$scope', '$state', '$timeout','$firebaseAuth', function($scope, $state, $timeout, $firebaseAuth){
  //firebase initialization and under that fbauth native firebase sdk
 
    
    var provider = new firebase.auth.FacebookAuthProvider();
    // fbLogin function 
    this.fbLogin = function(){
     
      firebase.auth().signInWithRedirect(provider);
      
      firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          console.log(result);
          // ...
        }
        
        // The signed-in user info.
        var user = result.user;
        console.log(user);
    /*    $timeout(function() { // angular is cute and weird at same time, timout is needed to $state.go to properly work
          $state.go('index', {result: result});
        }); */
 /*     }).catch(function(error) {
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
    
    
  
}])*/ // debug issues 

