
$(document).ready(function(){

  $('.carousel').carousel({dist:0});
   window.setInterval(function(){$('.carousel').carousel('next')},3200);

  
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

