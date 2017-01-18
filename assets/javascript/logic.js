//initialize date
var d = new Date();
var year = d.getFullYear();



// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA86KcIckWm_hvCyb8iIqRDB0tkL9q_aZI",
    authDomain: "marathontrainer-c4507.firebaseapp.com",
    databaseURL: "https://marathontrainer-c4507.firebaseio.com",
    storageBucket: "marathontrainer-c4507.appspot.com",
    messagingSenderId: "89102549201"
  };

  firebase.initializeApp(config);

//   •	marathon training
// o	Group
// o	Create training routes
// o	Maps api
// o	Meetup api
// o	Weather api
// o	http://www.icreon.us/nyrr.html
// o	Countdown to marathon
// o	Training guide


//TODO: 

// 1. Login - facebook & email/password
// 2. Profile Page
// 	- image
// 	- about
// 	- groups you are member of
// 		-view which users are online
// 		-chat feature (real time)
// 	- current running plan

// 			>> 16 weeks >> 7 days >> training exercise (begin exercise) 
// 									- status 
// 										running> 
// 										location> 
// 										route data
// 									- record completed run??? User record?
// 3. GPS locator
// 	- show location
// 	- use location for forecast of Weather
// 	- 
// 4. logout