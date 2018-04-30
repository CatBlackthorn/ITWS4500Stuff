const express = require('express');
const cors = require('cors');
const app = express()
const port = 3000

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var request = require("request");
var bearer_token = "AAAAAAAAAAAAAAAAAAAAALLc4gAAAAAAQmUOQI6BM%2BOYex0%2BOYV%2BTq2dR40%3DfiUSm2rzy8rfwV6o2MwRHIiiVFUdwbsn4hOsjIPOmOUrZDBrIK"; // the token you got in the last step
var twitter_api = 'https://api.twitter.com/1.1/search/tweets.json';
    

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

//Get this data from your twitter apps dashboard
var config = {
    "consumer_key": "3BLxHy0lFFCc7RZ0cSJtSBLzA",
    "consumer_secret": "WYDrJz2ZFu2aTZixGTMKQNVI0cyEryUHXgQQY8mov4reJ5lKqk",
    "access_token_key": "719254603875905537-pMhtjD5LWjiuviab7a0VSkbi9f8hJKM",
    "access_token_secret": "ALHOa0FAOxciJULWq50YZyfSoLenVcEoXUrEFqKEbi3Mr",
    "callBackUrl": ""
}

// make a directory in the root folder of your project called data
// copy the node_modules/twitter-node-client/twitter_config file over into data/twitter_config`
// Open `data/twitter_config` and supply your applications `consumerKey`, 'consumerSecret', 'accessToken', 'accessTokenSecret', 'callBackUrl' to the appropriate fields in your data/twitter_config file

app.get('/', (request,response) => {
    response.sendFile(__dirname + '/index.html');
});


app.get('/tweets', (req, response) => {
    // Gets the tweets with the number of tweets specified
    console.log(req.query.q);
    count = req.query.count;
    search = req.query.q;
    
    var options = {
        method: 'GET',
        url: twitter_api,
        qs: {
            "count": count,
            "q": search
        },
        json: true,
        headers: {
            "Authorization": "Bearer " + bearer_token,
            "Access-Control-Allow-Origin": "*"
        }
    };

    request(options, function(error, resp, body) {
        fs.writeFile('tweets.json', JSON.stringify(body), (err) => {
            if (err) console.log(err);
            else console.log('The file has been saved!');
        });
        response.send(body);
    });
    
    //var twitter = new Twitter(config);
    //twitter.getSearch({'q':search, 'count': count}, error, function(data) { response.send(data);});
    //twitter.getCustomApiCall('search/tweets.json',{'q':search, 'count': count}, error, function(data) {response.send(data);});
});

app.listen(port, (err) => {
      if (err) {
        return console.log('something bad happened', err)
      }

      console.log(`server is listening on ${port}`)
});