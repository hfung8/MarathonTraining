function getMaps(lat, long){
	
	var token;
	var api_key = "uj7d2fg236gukdznvrzs5bc4fqrfscda";

	//client side call of api to receive access token
	$.ajax({
		url: "https://oauth2-api.mapmyapi.com/v7.1/oauth2/access_token/",
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

			//token received, now to call api to get route information

			var endPoint= "https://oauth2-api.mapmyapi.com/v7.1/route/?";
			
			// the following will need to be changed to allow for user input as well
			var maximum_distance = 10000; //convert miles to meters
			var minimum_distance = 8000;

			// var queryUrl = endPoint + close_to_location + maximum_distance + minimum_distance;
			

			$.ajax({
				url: endPoint,
				method: 'GET',
				headers: {
					"api-key": api_key,
					Authorization: "Bearer " + token,
					"Content-Type": "application/json"
				},
				data: {
					close_to_location: lat + "," + long,
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

				console.log(namesArray);


				console.log(filteredResults);

				//select the first three maps to display
				//TODO: Optional -
					//don't filter results but have a scroll option

				var mapsForDisplay = filteredResults.slice(0,3);

				//create an iframe for each map, required by mapmyrun cdn
				mapsForDisplay.forEach(function(element) {
					var mapID = element._links.self[0].id;
					console.log(mapID);
					var frame = $("<iframe>").addClass("map").attr("id", mapID).attr("src", "//snippets.mapmycdn.com/routes/view/embedded/" + mapID + "?width=600&height=400&&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=0&unit_type=imperial&map_mode=ROADMAP").appendTo("#maps");
				})

			}).fail(function(error){
				console.log(error);
			});


	}).fail(function(error) {
		console.log(error);

	});

}

//get user ZIP code if geolocation not available
function getUserInput () {
  
  	$("form").show("fast");
  	$(document).on("click", "#submit-btn", function(event) {
	    event.preventDefault();
	    zip = $("#zip-entry").val();
	    $("#zip-entry").empty();
	    $("form").hide("fast");
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

		}).fail(function(error){
			console.log(error);
		});
	});
}

//check for browser geolocation data
function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    getUserInput();
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    getMaps(latitude, longitude);

  }

  function error() {
    output.innerHTML = "<p>Unable to retrieve your location at this time.</p>";
    getUserInput();
    return;
  }

  //output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}

$(document).ready(function(){
	geoFindMe();
});