//allow users to connect their fitbit

$("#fitbit-login").click(function(){
	var win = window.open("https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=2283WS&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Findex.html&scope=activity%20heartrate%20location%20profile%20weight&expires_in=604800", '_blank');
  	win.focus();
});


// var params = {}, queryString = location.hash.substring(1),
//     regex = /([^&=]+)=([^&]*)/g, m;

// while (m = regex.exec(queryString)) {
//   params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
// }
// console.log('params', params);


// $.ajax({
//   url: 'https://api.fitbit.com/1/user/-/profile.json',
//   headers: {
//     'Authorization': 'Bearer ' + params.access_token
//   },
//   success: function(data) {
//     console.log('data', data);

//   }
// });