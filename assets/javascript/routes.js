

var endPoint = "https://www.usatf.org/routes/search/searchResults.asp?";
var distanceFrom = "distance_from=";
var distanceTo = "&distance_to=";
var units = '&distanceUnits=mi';
var city = "&city=New+York";
var state = "&state=NY";
var country = "&country=US";
var terrain = "&terran=";
var tracks = "&includeTracks=yes";

var queryURL = endPoint + distanceFrom + distanceTo + units + city + state + country + terrain + tracks;


// $.ajax({
// 	url: queryURL,
// 	method: "GET"
// 	}).done(function(response){

// 	}).fail(function(error) {});
