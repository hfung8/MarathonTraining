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
    // var validPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (email.length < 4) {
      Materialize.toast('Please enter a valid email address.', 3000, 'rounded');
      return;
    }
    // if (!validPass.test(password)) {
    //   Materialize.toast('Please enter a valid password at least 8 characters long, that includes at least one uppercase letter, one lowercase letter, one number, and one special character.', 3000, 'rounded');
    //   return;
    // }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        Materialize.toast('This username/password is not registered with site. Please click on the "Register" button.', 3500);
      } else {
        Materialize.toast(errorMessage, 4000);
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
  var validPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if (email.length < 4) {
    Materialize.toast('Please enter a valid email address.', 3000, 'rounded');
    return;
  }
  if (!validPass.test(password)) {
    Materialize.toast('Please enter a valid password at least 8 characters long, that includes at least one uppercase letter, one lowercase letter, one number, and one special character.', 3000, 'rounded');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
    console.log(data);

    userId = data.uid;

    console.log(userId);

    database.ref('users/' + userId).set({
            
      email: email,

      displayName: displayName,

      date_created: firebase.database.ServerValue.TIMESTAMP,

    });

    //add training plan for user
    database.ref('plans/' + userId).set({
      training_plan: trainingPlan
    });

    var startDate = moment(new Date()).format("L");

    //set start date to today
    database.ref('plans/' + userId).update({
      'training_plan/startDate': startDate
    });

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    Materialize.toast(errorMessage, 5000);
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
    Materialize.toast('Email Verification Sent!', 3000);
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
    Materialize.toast('Password Reset Email Sent!', 3000);
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email' 
      || errorCode == 'auth/user-not-found') {
      Materialize.toast(errorMessage, 4000);
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
      localStorage.setItem("currentUserId", uid);

      console.log(uid);

      database.ref('users/' + uid).on('value', function(snapshot){
        console.log(snapshot.val());
        var displayName = snapshot.val().displayName;
        displayName = displayName.replace(/[+]/g," ");
        console.log(displayName);
        $("#display-name").text(displayName).attr("data-display_name", displayName);
        initChat(displayName);
      });



      $(".sign-out").show("fast");
      $(".login-btn").hide("fast");
      $(".register-btn").hide("fast");
      $("#page2").show('fast');

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
      $('#page2').hide("fast");
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




  // event listeners for email verification and password reset
  // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
  // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

$(document).ready(function() {
  initApp(); 
  $('.modal').modal();
});