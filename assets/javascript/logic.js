
$(document).ready(function(){
  $('.carousel.carousel-slider').carousel({full_width: true});
  $('#textarea1').val();
  $('#textarea1').trigger('autoresize');
  $(".button-collapse").sideNav();


// $(window).scroll(function() {
//     if ($(this).scrollTop() >= 80) {        // If page is scrolled more than 50px
//         $('#return2').fadeIn(200);    // Fade in the arrow
//     } else {
//         $('#return2').fadeOut(200);   // Else fade out the arrow
//     }
// });

$('#return2').click(function() {      // When arrow is clicked
  $('body,html').animate({
    scrollTop : 0                       // Scroll to top of body
    }, 800);
});
        


//initialize date
var d = new Date();
var year = d.getFullYear();

});

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