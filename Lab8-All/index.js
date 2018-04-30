const express = require('express');
const cors = require('cors');
const app = express()
app.use(express.static('public'));
const port = 3000
// Mongo Stuff
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// The CSV translation stuff
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

// Query and file system access
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

// Twitter access information
var request = require("request");
var bearer_token = "AAAAAAAAAAAAAAAAAAAAALLc4gAAAAAAQmUOQI6BM%2BOYex0%2BOYV%2BTq2dR40%3DfiUSm2rzy8rfwV6o2MwRHIiiVFUdwbsn4hOsjIPOmOUrZDBrIK"; // the token you got in the last step
var twitter_api = 'https://api.twitter.com/1.1/search/tweets.json';

// Access this across whatever domain   
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

//Get this data from your twitter apps dashboard
var config = {
    "consumer_key": "3BLxHy0lFFCc7RZ0cSJtSBLzA",
    "consumer_secret": "WYDrJz2ZFu2aTZixGTMKQNVI0cyEryUHXgQQY8mov4reJ5lKqk",
    "access_token_key": "719254603875905537-pMhtjD5LWjiuviab7a0VSkbi9f8hJKM",
    "access_token_secret": "ALHOa0FAOxciJULWq50YZyfSoLenVcEoXUrEFqKEbi3Mr",
    "callBackUrl": ""
}

// Translate to xml
var buildXML = function(json) {
    console.log(json);
    var xml = "<parent>";
    var i, total;
    for (i = 0, total = json.length; i < total; ++i) {
        xml += "<tweet><created_at>" + json[i].created_at;
        xml += "</created_at><text>" + json[i].text;
        xml += "</text><id>" + json[i].id_str;
        xml += "</id><user_id>" + json[i].user.id_str;
        xml += "</user_id><user_name>" + json[i].user.name;
        xml += "</user_name><user_screen_name>" + json[i].user.screen_name;
        xml += "</user_screen_name><user_location>" + json[i].user.location;
        xml += "</user_location><user_followers_count>" + json[i].user.followers_count;
        xml += "</user_followers_count><user_friends_count>" + json[i].user.friends_count;
        xml += "</user_friends_count><user_created_at>" + json[i].user.created_at;
        xml += "</user_created_at><user_time_zone>" + json[i].user.time_zone;
        xml += "</user_time_zone><user_profile_image_url>" + json[i].user.profile_image_url_https;
        if (typeof json[i].user.profile_background_color != 'undefined') {
            xml += "</user_profile_image_url><user_profile_background_color>" + json[i].user.profile_background_color;
        } else {
            xml += "</user_profile_image_url><user_profile_background_color>#0000FF";
        }
        xml += "</user_profile_background_color><geo>" + json[i].coordinates.coordinates;
        xml += "</geo><coordinates>" + json[i].coordinates.coordinates;
        xml += "</coordinates><place>" + json[i].place.name;
        xml += "</place></tweet>"
    }
    xml += "</parent>"
    return xml;
}

// Mongo information goes here. Essentially, put the get and export here, ada couple lines
var dburl = 'mongodb://localhost:27017/lab'
MongoClient.connect(dburl, function(err, database) {
    assert.equal(null, err);
     
    console.log("Connected to MongoDB");
    const db = database.db('lab')
  
    
    // Search tweets, throws in DB
    app.post('/search', function(req, res) {
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
            // Save the data into Mongo
            var tweets = db.collection('tweets');
            console.log((body.statuses).length);
            tweets.insert({date: new Date(), tweets: body.statuses}
            , function(err, result) {
                assert.equal(null, err);
                console.log("Inserted tweets");
                res.send("");
            });
        });
    });
	
    app.get('/tweets', (req, response) => {
        // returns the tweets from Mongo
        
        var tweets = db.collection('tweets');
        tweets.find({}).toArray(function(err, docs) {
            assert.equal(null, err);
            console.log("Retrieved Events");
            response.send(docs);
        });
        
        
        
    });
    
    app.get('/delete', (req, response) => {
        // deletes contents of mongoDB collection
        db.collection('tweets').drop();
        response.send("Database cleared")
        
        
        
    });
    
    app.get('/export', (req, response) => {
        // Gets the tweets with the number of tweets specified
        var format = req.query.format;
        var file = req.query.name;
        var fileName = file + "." + format;
        console.log(fileName);
        // Get tweets from db and consolidate them
        var statuses = [];
        var tweets = db.collection('tweets');
        tweets.find({}).toArray(function(err, docs) {
            assert.equal(null, err);
            var i, j, count, count2;
            for (i = 0, count = docs.length; i < count; i++) {
                for (j = 0, count2 = docs[i].tweets.length; j < count2; j++) {
                    statuses.push(docs[i].tweets[j]);
                }
            }
            
            var x = '';
            if (format == "json") {
                if (fs.existsSync(fileName)) {
                    console.log("Overwriting File\n");
                    x += 'Overwriting json file';
                } else {
                    x += 'Saving json file';
                }
                fs.writeFile(fileName, JSON.stringify(statuses), (err) => {
                    if (err) {
                        console.log(err);
                        x += '"msg": "error saving, failed"';
                    }
                    else {
                        console.log('The file has been saved!');
                        x += '"msg":"File saved"';
                    }
                });
            } else if (format == "csv") {
                if (fs.existsSync(fileName)) {
                    console.log("Overwriting File\n");
                    x += 'Overwriting csv file';
                } else {
                    x += 'Saving csv file';
                }
                try {
                    const csv = json2csv(statuses, opts);
                    fs.writeFile(fileName, csv, (err) => {
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
                
            } else if (format == "xml") {
                if (fs.existsSync(fileName)) {
                    console.log("Overwriting File\n");
                    x += 'Overwriting xml file';
                } else {
                    x += 'Saving xml file';
                }
                try {
                    console.log("before build");
                    var xml = buildxml(statuses);
                    console.log("before write");
                    fs.writeFile(fileName, xml, (err) => {
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
	
});
 


app.get("/", function(req,res) {
   res.sendFile("/public/index", { root: __dirname }); 
});

app.get("/page", function(req,res) {
   res.sendFile("/public/page.html", { root: __dirname }); 
});

app.listen(port, (err) => {
      if (err) {
        return console.log('something bad happened', err)
      }

      console.log(`server is listening on ${port}`)
});