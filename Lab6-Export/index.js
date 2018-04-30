const express = require('express');
const cors = require('cors');
const app = express()
app.use(express.static('public'));
const port = 3000

const json2csv = require('json2csv').parse;
const fields = [
		"created_at",
        {
            label: 'id',
            value: 'id_str'
        },
		"text",
		{
            label: 'user_id',
            value: 'user.id_str'
        },
		{
            label: 'user_name',
            value: 'user.name'
        },
		{
            label: 'user_screen_name',
            value: 'user.screen_name'
        },
		{
            label: 'user_location',
            value: 'user.location'
        },
        {
            label: 'user_followers_count',
            value: 'user.followers_count'
        },
        {
            label: 'user_friends_count',
            value: 'user.friends_count'
        },
		{
            label: 'user_created_at',
            value: 'user.created_at'
        },
        {
            label: 'user_time_zone',
            value: 'user.time_zone'
        },
        {
            label: 'user_profile_image_url',
            value: 'user.profile_image_url_https'
        },
		{
            label: 'user_profile_background_color',
            value: 'user.profile_background_color',
            default: '#0000FF'
        },
		{
            label: 'geo',
            value: 'coordinates.coordinates'
        },
		{
            label: 'coordinates',
            value: 'coordinates.coordinates'
        },
		{
            label: 'place',
            value: 'place.name'
        }
];
const opts = {fields};

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
        response.send(body);
    });
    
    //var twitter = new Twitter(config);
    //twitter.getSearch({'q':search, 'count': count}, error, function(data) { response.send(data);});
    //twitter.getCustomApiCall('search/tweets.json',{'q':search, 'count': count}, error, function(data) {response.send(data);});
});

app.get('/export', (req, response) => {
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
        var x = '';
        if (req.query.format == "json") {
            if (fs.existsSync("tweets.json")) {
                console.log("Overwriting File\n");
                x += 'Overwriting json file';
            } else {
                x += 'Saving json file';
            }
            fs.writeFile('tweets.json', JSON.stringify(body.statuses), (err) => {
                if (err) {
                    console.log(err);
                    x += '"msg": "error saving, failed"';
                }
                else {
                    console.log('The file has been saved!');
                    x += '"msg":"File saved"';
                }
            });
        } else if (req.query.format == "csv") {
            if (fs.existsSync("tweets.csv")) {
                console.log("Overwriting File\n");
                x += 'Overwriting csv file';
            } else {
                x += 'Saving csv file';
            }
            try {
                const csv = json2csv(body.statuses, opts);
                fs.writeFile('tweets.csv', csv, (err) => {
                    if (err) {
                        console.log(err);
                        x += '"msg": "error saving, failed"';
                    }
                    else {
                        console.log('The file has been saved!');
                        x += "'data': 'File saved'";
                    } 
                });
            } catch (err) {
                
            }
            
        }
        response.send(x);
    });
    
});

app.get("/", function(req,res) {
   res.sendFile("index", { root: __dirname }); 
});

app.listen(port, (err) => {
      if (err) {
        return console.log('something bad happened', err)
      }

      console.log(`server is listening on ${port}`)
});