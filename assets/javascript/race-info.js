//OAuth Key: 90ae1afd7b52cc642862463d12d975b73f6daa5e
//OAuth Secret: 398fb1b9e21f907be2bb97d6000f1f17e05b2945

function race_info(){
    var country = document.getElementById('country').value;
    var state = document.getElementById('state').value;
    var zipcode = document.getElementById('zipcode').value; 
    var date = document.getElementById('date').value; 
    
    $(".description").empty();
    $(".name").empty();

    $.ajax({
        type: "GET",
        url: "https://accept-cors.herokuapp.com/https://runsignup.com/Rest/races/?format=json&events=T&race_headings=T&race_links=T&include_waiver=T&include_event_days=T&page=1&results_per_page=50&sort=name+ASC&start_date=" + date + "&only_partner_races=T&search_start_date_only=T&only_races_with_results=T&city=New+York&state=" + state + "&country=" + country + "&event_type=running_race&distance_units=K&zipcode=" + zipcode + "&api_key=90ae1afd7b52cc642862463d12d975b73f6daa5e&api_secret=398fb1b9e21f907be2bb97d6000f1f17e05b2945",
        contentType: 'text/plain',
        xhrFields: {
            withCredentials: false
        },
        headers:{
            Host: 'www.runsignup.com',
            Accept: '*/*'
        },
        success: function(data){
            console.log(data);
            console.log(data.races);
            if (data.races.length === 0){   
                alert("Sorry, couldn't find any matches");
            };

            var description = data.races[0].race.description;
            var name = data.races[0].race.name; 
            console.log(description);
            $(".description").append(description);
            $(".name").append(name);
        },
        error: function(responseText, textStatus, errorThrown){
            alert("Error - " + errorThrown);
        }
    });
}


