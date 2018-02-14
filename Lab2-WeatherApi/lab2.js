
// Sets the Current weather condition of the page
function buildCurrentBox(json) {
    // See below comment
    var json = JSON.parse(json);
    var heading = document.createElement("h1");
    heading.innerHTML = "Current Condition";
    document.getElementsByTagName("BODY")[0].appendChild(heading);
    
    var box = document.createElement("div");
    box.setAttribute("class","currentBox");
    
    var loc = document.createElement("h2");
    loc.innerHTML = "Location:  " + json.current_observation.display_location.full;
    box.appendChild(loc);
    
    var cute = document.createElement("img");
    cute.setAttribute("src", json.current_observation.icon_url);
    box.appendChild(cute);
    
    var details = document.createElement("section");
    
    var curr = document.createElement("p");
    curr.innerHTML = json.current_observation.weather;
    details.appendChild(curr);
    
    var temp = document.createElement("p")
    temp.innerHTML = "Temperature:  " + json.current_observation.temperature_string;
    details.appendChild(temp);
    
    box.appendChild(details);
    document.getElementsByTagName("BODY")[0].appendChild(box);
    
}

// Sets up the forecast sextion of the page
function buildForecastBox(json) {
    // Considering building the box here and not within the success function down there
    
    var json = JSON.parse(json);
    var heading = document.createElement("h1");
    heading.innerHTML = "Future Forecast";
    document.getElementsByTagName("BODY")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("BODY")[0].appendChild(heading);
    
    var box = document.createElement("div");
    box.setAttribute("class","forecastBox");
    
    var days = json.forecast.txt_forecast.forecastday;
    var i = 1;
    while ( i < days.length ) {
        var box1 = document.createElement("div");
        box1.setAttribute("class", "block")
        
        var title = document.createElement("h4");
        title.innerHTML = days[i].title;
        box1.appendChild(title);
        
        var cute = document.createElement("img");
        cute.setAttribute("src", days[i].icon_url);
        box1.appendChild(cute);
        
        var details = document.createElement("section");
        
        var curr = document.createElement("p");
        curr.innerHTML = days[i].fcttext;
        details.appendChild(curr);
                
        box1.appendChild(details);
        box.appendChild(box1);
        i += 1;
    }
    
    document.getElementsByTagName("BODY")[0].appendChild(box);
}

// Builds Troy, NY dataset from static json
function autoSet() {
    // Autoset if all of a sudden the ajax refuses to work
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'testjson.json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            buildCurrentBox(xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
    
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'forecast.json');
    xhr2.onload = function() {
        if (xhr2.status === 200) {
            buildForecastBox(xhr2.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr2.status);
        }
    };
    xhr2.send();
}

// This query gets the data based on the location that the browser finds
function getData(position) {
    // Check what type position is
    alert(position);
    q = position.coords.latitude + "," + position.coords.longitude;
    key = "dd260b98e5d80c2d";
    console.log(q);
    
    // Need to make two different calls
    // First get current conditions
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://api.wunderground.com/api/" + key + "/conditions/q/" + q + ".json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            buildCurrentBox(xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
    
    // Get the forecast
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://api.wunderground.com/api/" + key + "/forecast/q/" + q + ".json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            buildForecastBox(xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
    // Attempted Ajax calls that just break and think data doesn't exist
    /*
    
    $.ajax({
        type: "GET",
        url: "http://api.wunderground.com/api/" + key + "/conditions/q/" + q + ".json",
        dataType: "jsonp",
        success: buildCurrentBox(data),
        error: function(status) {alert(status)}
    });
    
     $.ajax({
        type: "GET",
        url: "testjson.json",
        dataType: "jsonp",
        success: buildCurrentBox(data),
        error: function(status) {alert(status)}
    });
    */
}

// Determines whether geolocation is available and returns a position set or builds the
// webpage from static data
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData, autoSet);
    } else {
        alert("This browser does not support geolocation or you have it turned off");
    }
}

$(document).ready ( getLocation);