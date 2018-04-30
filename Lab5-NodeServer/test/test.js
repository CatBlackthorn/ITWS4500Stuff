/*** create-twitter-bearer-token.js ***/
var request = require('request');
var consumer_key = '3BLxHy0lFFCc7RZ0cSJtSBLzA';
var consumer_secret = 'WYDrJz2ZFu2aTZixGTMKQNVI0cyEryUHXgQQY8mov4reJ5lKqk';
var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
};

request.post(options, function(error, response, body) {
    console.log(body); // <<<< This is your BEARER TOKEN !!!
});

AAAAAAAAAAAAAAAAAAAAALLc4gAAAAAAQmUOQI6BM%2BOYex0%2BOYV%2BTq2dR40%3DfiUSm2rzy8rfwV6o2MwRHIiiVFUdwbsn4hOsjIPOmOUrZDBrIK