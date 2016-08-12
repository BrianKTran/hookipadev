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
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
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
    templateUrl: 'templates/logout.html'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'templates/about.html'
  });
 
   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

.controller('mainController', function($state){
  //fake data for developing
   
   this.username="Haribol";
   this.slogan="To feed is to love, GO Vegan";
   this.following= 108;
   this.followers= 254;
   this.rate = 4.8;
   this.active= true;
   this.image= 'images/pictures/1.jpg';
   this.profission="Profissional Chef";
   this.phone="+1 98575108";
   this.email="myEmail@provider.com";
   this.address="521 King Street, Melbourne Australia";
   this.about=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere convallis urna id mollis. Maecenas justo tellus, tristique vel dignissim non";
   
   this.login = function(){
     console.log("chamou a função");
     e.preventDefault();
     $state.go('index');
   };

});