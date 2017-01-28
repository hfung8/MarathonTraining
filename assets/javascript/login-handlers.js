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
    Materialize.toast('Please enter a valid password at least 8 characters long, that includes at least one uppercase letter, one lowercase letter, one number, and one special character.', 6000, 'rounded');
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

        //adds display name to profile page title
        $("#display-name").text(displayName).attr("data-display_name", displayName);
        
        //loads user data into chatroom
        initChat(displayName);

        //// DISABLED FITBIT ////
 
        //checks if user has previously connected to fitbit
        var hasToken = snapshot.hasChild("fitbit_access_token");
        if (hasToken) {
          //will see if user's fitbit session has expired
          
          var timestamp = snapshot.val().fitbit_timestamp;

          //convert timestamp into seconds for comparison
          timestamp = moment(timestamp).unix();
          console.log("Server Timestamp after conversion= " + timestamp);
          
          //get current time in unix seconds
          var time = moment(new Date()).format("X");
          console.log("Current Time= " + time);

          //fitbit login expires after 1 week
          if ((timestamp + 604800) < time) {
            $("#get-fitbit").show('fast');
          } else { 
            $("#get-fitbit").hide("fast");
          }
        }
      });
        
      //display current user's plan
      database.ref('plans/' + uid).on('value', function(snapshot){
        
        //check current date against start date of plan
        var d = moment(new Date());
        console.log(d);

        var startDate = snapshot.child('training_plan/startDate').val();
        console.log(startDate);

        startDate = moment(new Date(startDate)).format("L");

        var elapsedDays = d.diff(startDate, 'days');

        console.log("The difference between today," + d + ", and start, " + startDate + " = " + elapsedDays);

        //convert days into weeks and remaining days

        var week = Math.floor(elapsedDays/7);
        var day = elapsedDays - (week * 7);

        var planWeek = "week-" + week;
        var planDay = "day-" + day;

        var displayWeek = week + 1;
        var displayDay = day + 1;
        $("#week-num").text("Week " + displayWeek);
        $("#day-num").text("Day " + displayDay);

        var miles = snapshot.child('training_plan/' + planWeek + '/' + planDay + '/distance').val();
        console.log("Miles to be run today = " + miles);
        $("#miles").text(miles + " miles.");
        if (miles !== 0) {
          getRoutes(miles);
        }

        var type = snapshot.child('training_plan/' + planWeek + '/' + planDay + '/type').val();
        console.log("Today's workout is " + type);
        $("#run-type").text(type + " run.");

        var instruction = typeKeys[type];
        $("#instruction").text(instruction);

        console.log(instruction);

        var tBody = $("#runs");
        tBody.empty();
        for (let i = 0; i<16; i++) {
          var iWeek = "week-" + i;
          var highlight;
          if (iWeek == planWeek) {
            highlight="lime lighten-5";
          } else {
            highlight = "";
          }
          var iDisplay = i+1;
          var iRow = $("<tr>").attr("id", iWeek).addClass(highlight);
          var iCol = $("<td>").text("Week " + iDisplay).appendTo(iRow);
          for (let j=0; j<7; j++) {
            var jDay = "day-" + j;
            var mark;
            if (jDay == planDay && iWeek == planWeek) {
              mark ="white-text deep-orange darken-4";
            } else {
              mark = "";
            }
            var jDisplay = j+1;
            var jDistance = snapshot.child('training_plan/' + iWeek + '/' + jDay + '/distance').val();
            console.log(jDistance);
            var jCol = $("<td>").text(jDistance + " miles").attr("id", iWeek + "_" + jDay).addClass(mark).appendTo(iRow);
          }
          iRow.appendTo(tBody);

        }
      });




      $(".sign-out").show("fast");
      $(".login-btn").hide("fast");
      $(".register-btn").hide("fast");
      $("#profilepg").show('fast');

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
      $('#profilepg').hide("fast");
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