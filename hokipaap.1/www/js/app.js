// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'luegg.directives', 'ngCordova', 'uiGmapgoogle-maps', 'ngFileUpload'])

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
        templateUrl: 'templates/location.html',
        controller: 'mapCtrl',
        controllerAs: 'hari'
      }
    }
  })
  .state('hare.messages', {
    url: '/messages',
    views: {
      'menuContent': {
        templateUrl: 'templates/msg.html',
        controller: 'chatController',
        controllerAs: 'hari',
        params: 'talkid'
      },
    }
  })
  .state('hare.chats', {
    url: '/chats',
    views: {
      'menuContent': {
        templateUrl: 'templates/chats.html',
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

.controller('mainController', function($scope, $window, $state, $timeout, $stateParams, $firebaseAuth, $ionicModal, Upload){
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
  //function to add an image to fb strage so it can be uploaded into menu
      // upload on file select or drop
      var storage = firebase.storage();
      
      hari.quase=false;
      // Create a storage reference from our storage service
      var storageRef = storage.ref();
      
      // Create a child reference
      
      $scope.upload = function (file) {
         console.log(file);
         var uploadTask = storageRef.child(uid + '/menuImages/'+ file.name).put(file);
         uploadTask.on('state_changed', function(snapshot){
           hari.quase=true;
            // Observe state change events such as progress, pause, and resume
            console.log(snapshot); // b show how much has been uploaded / h show how much is the full / f shows processess running meanings still uploading 
          }, function(error) {
            console.log(error);
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // get the download URL: https://firebasestorage.googleapis.com/...
            hari.pronto = true;
            hari.quase=false;
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
            hari.filepath = downloadURL;
          });
      };
      // We add a message with a loading icon that will get updated with the shared image.
      hari.addImage = function(){
          console.log(hari.filepath);
      };
      // finish storage image function
      //show modal prompt for new menu item
       hari.newMenuFormShow = false; // setup show/hide new menu item form 
       hari.newMenuData = function(){
          firebase.database().ref('users/' + uid + '/menu/').push({
                name : hari.menuitem.name,
                picture: hari.filepath,
                description: hari.menuitem.desc,
                recipe: hari.menuitem.recipe,
                price: hari.menuitem.price,
                show: true,
                comments: false,
                likes: 0,
                shares: 0
          }); 
       };
      
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

.controller('chatController', function($scope, $timeout, $state, $stateParams){
  //write msg data to database
  var hari = this;
  var messages = [];
  var talks = [];
  var userId = firebase.auth().currentUser.uid; hari.userId = userId;
  var uname = firebase.auth().currentUser.displayName;
  var pic = firebase.auth().currentUser.photoURL;
  //get params from chat view, passing talkid
  console.log($stateParams);


  var talkKey = firebase.database().ref().child('messages').push().key;
  this.send = function() {
      firebase.database().ref('messages/' + talkKey ).push({
        text: this.text,
        sender: userId,
        name: uname,
        photoURL: pic
      });
      firebase.database().ref('users/' + userId + '/talks/').push(talkKey);
      this.text= "";
  };
  
  //add a listener to chats
  firebase.database().ref('users/'+ userId + '/talks/').on('child_added', function(data) {
    if(talks){
       talks.push(data.val());
    } else{
      talks = data.val();
    }
    console.log(talks);
    $timeout(function(){
      hari.talks = talks;
    });
  });
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
    for(var a in talks){
      for (var i in messages){
        if(a==i){
          console.log('semelhança');
        }
      }
    }
  }); 

  hari.goMsg = function(){ // set params when going to msg
    $state.go('hare.messages', {talkid: 'haribol'});
  };
})

.controller('mapCtrl', function($cordovaGeolocation, $timeout, $scope, $ionicSlideBoxDelegate, $state) {
  // snapshot chefs geolocation from firebase realtime db
  firebase.database().ref('/users/').once('value').then(function(snapshot) {
     $scope.marker = [];
      //show infoWindow at chefs marker
      $scope.windowOptions = {
            visible: true
        };
        $scope.onClick = function(id) {
            $scope.windowOptions.visible = true;
            console.log(id);
            $scope.username = snapshot.val()[id].username;
            $scope.pic = snapshot.val()[id].picture;
            $scope.rate = snapshot.val()[id].rate;
            $scope.profission = snapshot.val()[id].ocupation;
            $scope.phone = snapshot.val()[id].phone;
            $scope.email = snapshot.val()[id].email;
            $scope.menu = snapshot.val()[id].menu;
            $scope.address = snapshot.val()[id].address;
            $scope.active = snapshot.val()[id].online;
      //      $scope.following = snapshot.val()[id].length;
      //      $scope.followers = snapshot.val()[id].length;
            
        };

        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };

        $scope.title = "Window Title!";
    for( var a in snapshot.val()){ // push chefs geoloc and ids to markers array
      $scope.marker.push({id: a, latitude: snapshot.val()[a].geolocation.lat , longitude: snapshot.val()[a].geolocation.long});
    }
   console.log($scope.marker);  
  });
  $scope.map = { center: { latitude: -23.485355, longitude: -46.71833 }, zoom: 8 }; // set map center, any value (us lat = 45 , long = -73)

  //getting geolocatization with ngcordova plugin
  console.log('até aqui, haribol');
  var hari = this;
   var posOptions = {timeout: 10000, enableHighAccuracy: false};
   $cordovaGeolocation
   .getCurrentPosition(posOptions)
	
   .then(function (position) {
      var lat  = position.coords.latitude;
      hari.long = position.coords.longitude;
      $scope.map = { center: { latitude: lat, longitude: hari.long }, zoom: 15 };
      }, function(err) {
      console.log(err);
      hari.err = err;
   });

   var watchOptions = {timeout : 3000, enableHighAccuracy: false};
   var watch = $cordovaGeolocation.watchPosition(watchOptions);
	
   watch.then(
      null,
		
      function(err) {
         console.log(err)
      },
		
      function(position) {
         var lat  = position.coords.latitude
         this.long = position.coords.longitude
         console.log(lat + '' )
      }
   );

   watch.clearWatch();
  console.log('hari, hari');
 
  // Called to navigate to the main app

  

});
