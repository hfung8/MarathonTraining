var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;

while (m = regex.exec(queryString)) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

console.log('params', params);

if(params) {
  var userId = localStorage.getItem("currentUserId");
  console.log("User ID = " + userId);
  database.ref("users/" + userId).set({
    fitbit_access_token: params.access_token
  });
  callFitbit(params);
}

function callFitbit (params) {

  $.ajax({
    url: 'https://api.fitbit.com/1/user/-/profile.json',
    headers: {
      'Authorization': 'Bearer ' + params.access_token
    },
    success: function(data) {
      console.log('fitbit user data', data);

      var userId = data.user.encodedId;
      var userName = data.user.displayName;
      var userImage = data.user.avatar;


      function writeUserData() {
        firebase.database().ref('users/' + userId).set({
          loginAuth: "fitbit",

          fitbitAccessToken: params.access_token,

          username: userName,

          profile_picture: userImage,

          lastLogin: firebase.database.ServerValue.TIMESTAMP
        });
      }

      $.ajax({
        url: 'https://api.fitbit.com/1/user/-/activities/date/2017-01-20.json',
        headers: {
          'Authorization': 'Bearer ' + params.access_token
        },

        success: function(response) {
          console.log('activites data', response);
        },
        error: function(error) {
          console.log(error);
        }

      });
    }
  });
}
