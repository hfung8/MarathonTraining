// Initialize Firebase
const config = {
  apiKey: "AIzaSyA86KcIckWm_hvCyb8iIqRDB0tkL9q_aZI",
  authDomain: "marathontrainer-c4507.firebaseapp.com",
  databaseURL: "https://marathontrainer-c4507.firebaseio.com",
  storageBucket: "marathontrainer-c4507.appspot.com",
  messagingSenderId: "89102549201"
};

firebase.initializeApp(config);

const database = firebase.database();

var email, displayName;

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {

  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    email = $('#email').val().trim();
    console.log("user entered " + email);
    var password = $('#password').val().trim();
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);

      // [END_EXCLUDE]
    });
    console.log("logged-in");
    // [END authwithemail]
  }
}

/**
 * Handles the sign up button press on registration page
 */
function handleSignUp() {
  email = $('#email').val().trim();
  var password = $('#password').val().trim();
  var firstName = $('#first_name').val().trim();
  var lastName = $('#last_name').val().trim();
  displayName = firstName + "+" + lastName;
  console.log(displayName);
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
    console.log(data);

    userId = data.uid;

    console.log(userId);

    database.ref('users/' + userId).push({
            
      email: email,

      displayName: displayName,

      date_created: firebase.database.ServerValue.TIMESTAMP
    });

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}

function sendPasswordReset() {
  email = $('#email').val().trim();
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    // document.getElementById('quickstart-verify-email').disabled = true;
    // [END_EXCLUDE]
    if (user) {
      // User is signed in.
      

      var uid = user.uid;

      console.log(uid);

      database.ref('users/' + uid).on('value', function(snapshot){
        console.log(snapshot.val());
        var displayName = snapshot.val().displayName;
        $("#name").text(displayName.replace(/[+]/g," "));

      });

      $(".sign-out").show("fast");
      $(".login-btn").hide("fast");
      $(".register-btn").hide("fast");
      $("#page2").hide('fast');

      console.log("Signed-in");

      

      geoFindMe();
      // if (!emailVerified) {
      //   document.getElementById('quickstart-verify-email').disabled = false;
      // }

    } else {

      console.log("Signed-out");
      $(".sign-out").hide("fast");
      $(".login-btn").show("fast");
      $(".register-btn").show("fast");
      $('#page2').show("fast");
      // User is signed out.
      
    }

  });
  // [END authstatelistener]

  //navbar buttons 
  $(".login-btn").click(function(){
    $(".login").show('fast');
    $(".register").hide('fast');
  });

  $(".register-btn").click(function(){
    $('.register').show('fast');
    $(".login").hide('fast');
  });

  //sign-in, sign-out buttons on form
  $('#sign-in').click(toggleSignIn);
  $('.sign-out').click(toggleSignIn);
  $('#sign-up').click(handleSignUp);
  


  $("#fitbit-login").click(function(){
    var win = window.open("https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=2283WS&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Findex.html&scope=activity%20heartrate%20location%20profile%20weight&expires_in=604800", '_blank');
      win.focus();
  });
  // event listeners for email verification and password reset
  // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
  // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

$(document).ready(function() {
  initApp();  


});