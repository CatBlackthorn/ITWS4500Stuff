const express = require('express')
const request = require('request');
const app = express()
const port = 3000

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

app.get('/', (req, response) => {
  
  response.sendFile(__dirname +'/index.html');
})

app.get('/refresh', (req, response) => {
  
  response.sendFile(__dirname +'/index.html');
})

app.get('/conditions', (req, response) => {
  // Gets the tweets with the number of tweets specified
  code = req.query.zipcode;
  var url = "http://api.wunderground.com/api/dd260b98e5d80c2d/conditions/q/" + code + ".json";
  console.log(url);
  answer = "No results found";
  // request module is used to process the yql url and return the results in JSON format
  request(url, function(err, resp, body) {
    body = JSON.parse(body);
    // logic used to compare search results with the input from user
    if (err != null) {
      answer = "No results found. Try again.";
      console.log("uh");
      response.send(answer);
    } else {
      // Build the code and send it forward
      answer = body.current_observation.display_location.full + " is ";
      
      temp = parseInt(body.current_observation.temp_c);
      console.log(temp);
      switch (temp) {
        case temp <= 0:
          answer = body.current_observation.display_location.full + " is Freezing";
          break;
        case temp <= 10:
          answer = body.current_observation.display_location.full + " is Cold";
          break;
        case temp <= 25:
          answer = body.current_observation.display_location.full + " is Warm";
          break;
        case temp > 25:
          answer = body.current_observation.display_location.full + " is Hot";
      }  
      response.send(answer); 
    }
  });
  
   
})



app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})