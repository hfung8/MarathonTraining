//get date/time
var d = new Date();
var year = d.getFullYear();
$("#year").text(year);
var time = d.toLocaleTimeString("en-US",{ hour12: false });
var hour = d.getHours();

//Wunderground API  
var keyId="2145db27285d6fbd";
var city="NY/New+York",
  zip="07011",
  lat="40.867507",
  lon="-74.142158",
  api= "https://api.wunderground.com/api/" + keyId;
var conditions = api + '/conditions/q/';
var geolookup = api + '/geolookup/q/';

      
var weatherIcon = "https://icons.wxug.com/i/c/i/";

var celsius=0;
var fahrenheit=0;
var weather = '';

var backgrounds = {
  day: {
    clearCold: "https://static.pexels.com/photos/67749/pexels-photo-67749.jpeg",
    clearHot: "https://static.pexels.com/photos/40976/beach-beautiful-blue-coast-40976.jpeg",
    partly: "https://static.pexels.com/photos/97906/pexels-photo-97906.jpeg",
    cloudy: "https://static.pexels.com/photos/29859/pexels-photo-29859.jpg",
    snow: "https://static.pexels.com/photos/65911/winter-nature-season-trees-65911.jpeg",
    rain: "https://static.pexels.com/photos/166360/pexels-photo-166360.jpeg",
    ice: "https://static.pexels.com/photos/42266/ice-winter-weather-cold-42266.jpeg",
    storm: "https://static.pexels.com/photos/53459/lightning-storm-weather-sky-53459.jpeg",
    fog: "https://static.pexels.com/photos/5230/road-fog-foggy-mist.jpg"
  },
  night: {
    clearCold: "https://static.pexels.com/photos/102594/pexels-photo-102594.jpeg",
    clearHot: "https://static.pexels.com/photos/26171/pexels-photo.jpg",
    rain: "https://static.pexels.com/photos/119569/pexels-photo-119569.jpeg",
    snow: "https://static.pexels.com/photos/29756/pexels-photo-29756.jpg",
    storm: "https://static.pexels.com/photos/28774/pexels-photo-28774.jpg",
    ice: "https://static.pexels.com/photos/28247/pexels-photo-28247.jpg",
    partly: "https://static.pexels.com/photos/239107/pexels-photo-239107.jpeg",
    cloudy: "https://static.pexels.com/photos/30376/pexels-photo-30376.jpg",
    fog: "https://static.pexels.com/photos/42263/foggy-mist-forest-trees-42263.jpeg"
  }
}

function changeBackground() {
  var w, tod;
  if (hour >= 18 || hour < 6) {
    tod = "night";
  } else {
    tod = "day";
  }
  weather = weather.toLowerCase();
  
  if (weather.includes("thunder") || weather.includes("hail") || weather.includes("ash") || weather.includes("squalls") || weather.includes("funnel")) {
    w = "storm";
  } else if (weather.includes("snow")) {
    w = "snow";
  } else if (weather.includes("freezing") || weather.includes("ice")) {
    w = "ice";
  } else if (weather.includes("fog") || weather.includes("haze") || weather.includes("smoke") || weather.includes("dust")) {
    w ="fog";
  } else if (weather.includes("partly")) {
    w ="partly";
  } else if (weather.includes("cloud") || weather.includes("overcast")) {
    w ="cloudy";
  } else if (weather.includes("rain") || weather.includes("mist") || weather.includes("drizzle")) {
    w = "rain";
  } else {
    if (fahrenheit > 60) {
      w = "clearHot";
    } else {
      w = "clearCold";
    }
  }
  
  var backgroundURL = backgrounds[tod][w];
  $("#weather-img").attr("src", backgroundURL);
  
}

function getWeather(index) {
    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: conditions + index + ".json",
      method: "GET"
    }).done(function(response) {
      // Log the data in HTML
      console.log(response);
      $("#main").show();
      $(".city").text(response.current_observation.display_location.full);
      lat = response.current_observation.display_location.latitude;
      lon = response.current_observation.display_location.longitude;
      $(".lat").text(lat);
      $(".lon").text(lon);
      var img = new Image();
      img.src = response.current_observation.icon_url;
      weather = response.current_observation.weather;
      $(".conditions").text(weather);
      $(".wind").text("Wind " + response.current_observation.wind_string);
      $(".humidity").text("Humidity: " + response.current_observation.relative_humidity);
      fahrenheit = response.current_observation.temp_f + "&#8457;";
      celsius = response.current_observation.temp_c + "&#8451;";
      $(".temp").html(fahrenheit);
      $("#temp-toggle").show();
      var newTime = new Date(response.current_observation.observation_time_rfc822);
      time = newTime.toLocaleTimeString("en-US",{ hour12: false });
      hour = newTime.getHours();
      $(".time").text(time);
      
      changeBackground();
      // setInterval(getWeather(index), 600000); //update weather after ten minutes
    })
  .fail(function(){});
}

$(document).on("click", "#celsius", function() {
  $(".temp").html(celsius);
});

$(document).on("click", "#fahrenheit", function(){
  $(".temp").html(fahrenheit);
});


function getMapToken(){
  
  var token;
  var api_key = "uj7d2fg236gukdznvrzs5bc4fqrfscda";

  //client side call of api to receive access token
  jQuery_3_1_1.ajax({
    url: "https://oauth2-api.mapmyapi.com/v7.1/oauth2/access_token/",//"https://api.ua.com/v7.1/oauth2/access_token/",
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      grant_type: 'client_credentials',
      client_id: 'uj7d2fg236gukdznvrzs5bc4fqrfscda',
      client_secret: 'ZZRCuq9cxbF34RydE7JjSpHsNpeSCytRF5kjyA27DaU'
    },
    headers: {
      'api-key': api_key
    }
  }).done(function(response){
    console.log(response);
    token = response.access_token;

    //store token in local storage
    localStorage.setItem("mapmyapi_token", token);

  }).fail(function(error) {
    console.log(error);

  });

}

function getRoutes(distance) {

  var endPoint= "https://oauth2-api.mapmyapi.com/v7.1/route/?";
  var api_key = "uj7d2fg236gukdznvrzs5bc4fqrfscda";
  
  var maximum_distance, minimum_distance;
  
  function convertMilesToMeters(distance) {
    var meters = distance * 1600;
    maximum_distance = meters + 800;
    minimum_distance = meters - 800;
  }

  convertMilesToMeters(distance);
  var token = localStorage.getItem("mapmyapi_token");
  var lat = localStorage.getItem("lat");
  var lon = localStorage.getItem("lon");
  // var queryUrl = endPoint + close_to_location + maximum_distance + minimum_distance;
  //jQuery_3_1_1 is a placeholder for $ function from v3.1.1 using noConflict()
  jQuery_3_1_1.ajax({
    url: endPoint,
    method: 'GET',
    headers: {
      "api-key": api_key,
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    data: {
      close_to_location: lat + "," + lon,
      maximum_distance: maximum_distance,
      minimum_distance: minimum_distance,
      text_search: "run",
      order_by: "+distance_from_point"
    }
  }).done(function(response){
    console.log(response);
    //api successfully called

    var namesArray = [], filteredResults = [];

    //remove duplicate named items from results

    for (let i = 0; i < response._embedded.routes.length; i++) {
      if (namesArray.indexOf(response._embedded.routes[i].name) == -1) {
        namesArray.push(response._embedded.routes[i].name);
        filteredResults.push(response._embedded.routes[i]);
      }
    }

    //create an iframe for each map, required by mapmyrun cdn
    filteredResults.forEach(function(element) {
      var mapID = element._links.self[0].id;
      console.log(mapID);
      var wrapper = $("<div>").addClass("map-wrapper");
      var url = "https://snippets.mapmycdn.com/routes/view/embedded/" + mapID + "?width=400&height=380&&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=0&unit_type=imperial&map_mode=ROADMAP";
      console.log("Get map @ " + url);
      var frame = $("<iframe>").addClass("map").attr("id", mapID).attr("src", url).appendTo(wrapper);
      $("#maps").append(wrapper);  
    });

  }).fail(function(error){
    console.log(error);
  });
}

//get user ZIP code if geolocation not available
function getUserInput() {
  
  $("#location-form").show("fast");
  $(document).on("click", "#submit-btn", function(event) {
    event.preventDefault();
    zip = $("#zip-entry").val();
    $("#zip-entry").empty();
    $("#location-form").hide("fast");
    $("#out").empty();

      //use Wunderground to get geolocation data
      //Wunderground API  

        //note, there is a limit of calls to Wunderground API per minute
    var keyId="2145db27285d6fbd";
    var api= "https://api.wunderground.com/api/" + keyId;
    var geolookup = api + '/geolookup/q/'; 
    var queryUrl = geolookup + zip + ".json";

    $.ajax({
      url: queryUrl,
      method: "GET"
    }).done(function(response){

      //send latitude and longitude data to getMaps
      getMaps(response.location.lat, response.location.lon);
      getWeather(zip);

    }).fail(function(error){
      console.log(error);
    });
  });
}



function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    getUserInputW();
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    localStorage.setItem("lat", latitude);
    var longitude = position.coords.longitude;
    localStorage.setItem("lon", longitude);
    var ltln = latitude + "," + longitude;
    getWeather(ltln);
    getMapToken();

//     var img = new Image();
//     img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

//     output.appendChild(img);
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location at this time.";
    getUserInputW();
    return;
  }

  //output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}