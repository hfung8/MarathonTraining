
$(document).ready(function(){
	var d = new Date();
	var year = d.getFullYear();

	console.log("************");
	console.log("RCB[Runner's CluB] developed by:");
	console.log("____________");
	console.log("Franco Sevillano: https://github.com/fasevillano1");
	console.log("-");
	console.log("Harrison Fung: https://github.com/hfung8");
	console.log("-");
	console.log("Jihyun Gong: https://github.com/JihyunH");
	console.log("-");
	console.log("Wesley Handy: https://github.com/wesleylhandy");
	console.log("************");
	console.log("Copyright @ " + year);
	console.log("************");

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

	jQuery_3_1_1('#return2').click(function() {      // When arrow is clicked
	  jQuery_3_1_1('body,html').animate({
	    scrollTop : 0                       // Scroll to top of body
	    }, 800);
	});

	jQuery_3_1_1('.smooth').click(function() {
	      // When arrow is clicked
	    var id = jQuery_3_1_1(this).attr("href");
	    // console.log(id);
		jQuery_3_1_1('html, body').animate({
        scrollTop: jQuery_3_1_1(id).offset().top
    		}, 2000);
	});


	$("#comment-btn").click(function(event){
		event.preventDefault();
		var message = $("#textarea1").val().trim();

		database.ref("comments/").push({
			message: message,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		});

		$('#textarea1').val('');

		$('#modal-thanks').modal('open');

		function closeModal() {
			$('#modal-thanks').modal('close');
		}

		close = setTimeout(closeModal, 2500);

	});
});