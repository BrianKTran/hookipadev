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
  
  .state('hare', {
    url: '/hare',
    abstract: true,
    templateUrl: 'templates/side-menu.html'
    
  })
  .state('hare.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
    
  })
  .state('hare.index', {
    url: '/',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html'
      }
    }
  })
   .state('hare.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html'
      }
    }
  })
  .state('hare.notification', {
    url: '/notification',
    views: {
      'menuContent': {
        templateUrl: 'templates/notify.html'
      }
    }
  })
  .state('hare.editprofile', {
    url: '/editProfile',
    views: {
      'menuContent': {
        templateUrl: 'templates/editprofile.html'
      }
    }
  })
  .state('hare.calendar', {
    url: '/calendar',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendar.html'
      }
    }
  })
  .state('hare.location', {
    url: '/location',
    views: {
      'menuContent': {
        templateUrl: 'templates/location.html'
      }
    }
  })
  .state('hare.messages', {
    url: '/messages',
    views: {
      'menuContent': {
        templateUrl: 'templates/msg.html'
      }
    }
  })
  .state('hare.paymentOptions', {
    url: '/payopt',
    views: {
      'menuContent': {
        templateUrl: 'templates/payopt.html'
      }
    }
  })
  .state('hare.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html'
      }
    }
  })
  .state('hare.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  }) 
  .state('hare.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  });
 
   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/hare/login');
})



.controller('mainController', function($window, $state, $timeout, $stateParams, $firebaseAuth){
  console.log('Hare Krsna');
  
 var hari = this;
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      hari.loggedIn = true; // no code can came before this statement
      $state.go('hare.index');
      var uid= user.uid;
      var uid= user.uid
      hari.username= user.displayName;
      hari.email= user.email;
      hari.image= user.photoURL;
      console.log(user); // if user is sign in

      
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        if(snapshot.val() === null){
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
               
        }else{
           var username = snapshot.val().username;
            if(snapshot.val().username){ // user exists on database
             console.log(username); 
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
            $state.go('hare.login');
      });
    }
  }); 
    
     
// fake data for development
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
            $state.go('hare.index', {result: result});
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
 

});
