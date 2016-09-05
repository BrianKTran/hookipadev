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
        templateUrl: 'templates/msg.html',
        controller: 'chatController',
        controllerAs: 'hari'
      },
    }
  })
  .state('hare.chats', {
    url: '/chats',
    views: {
      'menuContent': {
        templateUrl: 'templates/msg.html',
        controller: 'chatController',
        controllerAs: 'hari'
      },
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


.controller('mainController', function($scope, $window, $state, $timeout, $stateParams, $firebaseAuth){
  console.log('Hare Krsna');
  
 var hari = this;
  //the following verify if user is logged 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // all actions must be inserted inside this if statment, or if in diferent controller, a similar must be there, once we required user to be logged for use the app.
      hari.loggedIn = true; // no code can came before this statement
      $state.go('hare.index');
      var uid= user.uid;
      console.log(user); // if user is sign in

      // the follow is verifing if user already in database, and if it is not, it'll create him there
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
                menu: "",
                online: false   // this will make user able to set on/off mode (realtimedatabase!)
                
              });
              console.log("user sent to database");
            // also send user id to 'followers' and 'following' object
            firebase.database().ref('followers/' + userId).set({
                userid: true
            });
            firebase.database().ref('following/' + userId).set({
                userid: true
            });
        }else{ 
           var username = snapshot.val().username;
            if(snapshot.val().username){ // user exists on database
             console.log(username); 
            }
            hari.rate = snapshot.val().rate;
            hari.phone = snapshot.val().phone;
            hari.active = snapshot.val().online;
            hari.address = snapshot.val().address;
            hari.profission = snapshot.val().ocupation;
            hari.picture = snapshot.val().picture;
            hari.username= snapshot.val().username;
            hari.email= snapshot.val().email;
        } 
        // ... 
      }); // end of function to verify and create user at realtime database
      // the following is taking the users followers from database
      firebase.database().ref('/followers/' + userId).once('value').then(function(snapshot) {
           var fol = snapshot.val(); 
           hari.followers = Object.keys(fol).length; // atribute to $scope.followers the number of followers in database  
      });  
      // the following takes who user follows (following object)
       firebase.database().ref('/following/' + userId).once('value').then(function(snapshot) {
           var fol = snapshot.val(); 
           hari.following = Object.keys(fol).length; // atribute to $scope.folling the number users it follows in database  
      }); 
      
      // code for edit profile data
      /*
      hari.newName = hari.username;
      hari.newPhone = hari.phone;
      hari.newEmail = hari.email;
      hari.newAddress = hari.address;
      hari.newOcupation = hari.ocupation;
      hari.newPic = hari.image;
      */
      hari.editProfile = function() {
          // each line'll update individual item, otherwise if updating all, other itens will be deleted.
          var updates = {};
          if(hari.newName){
             updates['/users/' + uid + '/username'] = hari.newName; // path and data to update
             $scope.editName = false;
          }
          if(hari.newPhone){
             updates['/users/' + uid + '/phone'] = hari.newPhone;
             $scope.editPhone = false;
          } 
          if(hari.newEmail){
            updates['/users/' + uid + '/email'] = hari.newEmail;
            $scope.editEmail = false;
          }
          if(hari.newAddress){
            updates['/users/' + uid + '/address'] = hari.newAddress; 
            $scope.editAdress = false;
          }
          if(hari.newOcupation){
            updates['/users/' + uid + '/ocupation'] = hari.newOcupation;
          }
          if(hari.newPic){
            updates['/users/' + uid + '/picture'] = hari.newPic; 
            $scope.editPic = false;
          }
          return firebase.database().ref().update(updates); // code for updating 
      };
      // code for chat

      
   // following code is for no logged users
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
   this.slogan="To feed is to love, GO Vegan";
   this.about=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere convallis urna id mollis. Maecenas justo tellus, tristique vel dignissim non";
   
   //fake menu data
   this.menu = [
      {
       name : 'bolo prassad',
       picture: 'picture',
       description: 'this is a nice cake that has been offered to Supreme Lord Sri Krsna. It is only for his mercy that is and ouservls exists',
       recipe: 'make a very nice ekadasi cake and then offer to our supreme Lord <3 Hari! Hari se vara Hari ka naam',
       price: 108,
       show: true,
       comments: [],
       likes: 0,
       shares: 0
       
     },
      {
       name : 'bolo prassad2',
       picture: 'picture',
       description: 'this is a nice cake that has been offered to Supreme Lord Sri Krsna. It is only for his mercy that is and ouservls exists',
       recipe: 'make a very nice ekadasi cake and then offer to our supreme Lord <3 Hari! Hari se vara Hari ka naam',
       price: 108,
       show: true,
       comments: [{ uid:'tal'}, {uid2:'tal'}],
       likes: 0,
       shares: 0
       
      }
   ];
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
  this.quantity = 0;  
  this.add = function(){
    this.quantity++;
  };
  this.minus = function(){
    this.quantity--;
  };
})

.controller('chatController', function($scope, $timeout){
  //write msg data to database
  var hari = this;
  var messages = [];
  var userId = firebase.auth().currentUser.uid; hari.userId = userId;
  var uname = firebase.auth().currentUser.displayName;
  var pic = firebase.auth().currentUser.photoURL;
  this.send = function() {
      firebase.database().ref('messages/' ).push({
        text: this.text,
        sender: userId,
        name: uname,
        photoURL: pic
      });
      this.text= "";
  };
  // add a listener to menssages add so they can be displayed
  
  var msgRef = firebase.database().ref('messages/' );
  msgRef.on('child_added', function(data) {
    if(messages){
       messages.push(data.val());
    } else{
      messages = data.val();
    }
    console.log(messages);
    $timeout(function(){
      hari.messages = messages;
    });
    
    
  }); 
 /*
  firebase.database().ref('/messages').once('value').then(function(snapshot) {
         var fol = snapshot.val(); 
         hari.messages= fol;
         console.log(hari.messages);
  });    */
  

  

});
