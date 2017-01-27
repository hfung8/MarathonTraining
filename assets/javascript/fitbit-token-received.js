var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;

while (m = regex.exec(queryString)) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

console.log('params', params);

if(params.access_token) {
  $("#get-fitbit").hide('fast');
  var userId = localStorage.getItem("currentUserId");
  console.log("User ID = " + userId);
  console.log(params.access_token);
  database.ref("users/" + userId).update({
    fitbit_access_token: params.access_token,
    fitbit_timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  callFitbit(params.access_token);
}

function callFitbit (access_token) {

  $.ajax({
    url: 'https://api.fitbit.com/1/user/-/profile.json',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function(data) {
      console.log('fitbit user data', data);

      var userId = data.user.encodedId;
      var userName = data.user.displayName;
      var userImage = data.user.avatar;

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
