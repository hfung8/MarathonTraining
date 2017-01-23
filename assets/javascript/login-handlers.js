/**
 * Handles the sign in button press.
 */
function toggleSignIn(source) {

  if (source === "email" && !firebase.auth().currentUser) {
    
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();
    $("input").val('');
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
    // [END authwithemail]
  } else if (source === "facebook" && !firebase.auth().currentUser) {
    /**
     * Function called when clicking the facebook login.
    */

    // [START createprovider]
    var provider = new firebase.auth.FacebookAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('user_birthday');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // [START_EXCLUDE]
      // document.getElementById('quickstart-oauthtoken').textContent = token;
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]
  } else {
    //this means someone clicked logout button
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
}

/**
 * Handles the sign up button press on registration page
 */
function handleSignUp() {
  var email = $('#email').val().trim();
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
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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
  var email = $('#email').val().trim();
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
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      // $("#sign-out").show("fast");
      // $("#sign-in").hide("fast");
      // $("#sign-up").hide("fast");

      
      // if (!emailVerified) {
      //   document.getElementById('quickstart-verify-email').disabled = false;
      // }

    } else {

      // $("#sign-out").hide("fast");
      // $("#sign-in").show("fast");
      // $("#sign-up").show("fast");
      // User is signed out.
      
    }

  });
  // [END authstatelistener]
  $('#email-login').click(function() {toggleSignIn("email")});
  $('#facebook-login').click(function() {toggleSignIn("facebook")});
  $('#sign-up').click(handleSignUp);
  $('#sign-out').click(toggleSignIn);
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