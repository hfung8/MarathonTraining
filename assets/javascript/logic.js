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

// 1. Login - facebook & email/password --in progress
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

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid, emailVerified;

	if (user != null) {
		name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		emailVerified = user.emailVerified;
		uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
	                   // this value to authenticate with your backend server, if
	                   // you have one. Use User.getToken() instead.
	    user.providerData.forEach(function (profile) {
    		console.log("Sign-in provider: "+profile.providerId);
    		console.log("  Provider-specific UID: "+profile.uid);
    		console.log("  Name: "+profile.displayName);
    		console.log("  Email: "+profile.email);
    		console.log("  Photo URL: "+profile.photoURL);
  		});
}
  } else {
    // No user is signed in.
  }
});

firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});