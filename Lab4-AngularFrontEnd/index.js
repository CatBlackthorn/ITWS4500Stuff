var app = angular.module('indexApp', []);

app.controller('weatherRead', ['$scope','$http', function($scope, $http) {
	
	$scope.weatherData = {};
    $scope.zipcode = 12180;
    // http://api.wunderground.com/api/dd260b98e5d80c2d/forecast/q/12180.json
    $http.get("http://api.wunderground.com/api/dd260b98e5d80c2d/forecast/q/12180.json")
    .then(function(response) {
        $scope.weatherData = response.data;
    });
    
    $scope.search = function() {
       $http.get("http://api.wunderground.com/api/dd260b98e5d80c2d/forecast/q/"+$scope.zipcode+".json")
        .then(function(response) {
            $scope.weatherData = response.data;
        }); 
    }
	
}]);

app.controller('tweetRead', function($scope, $http) {
	
	$scope.tweets = {};
    $scope.token = "";
    $scope.bearer = "";
    
    $scope.search = function() {
        if ($scope.token === "") {
            alert("HELLO");
            $http.defaults.headers.common['Authorization'] = "Basic "+ $.base64.encode("	O2ByClYuWm6mtGtvo9tu1rr8T"+":"+"0FC4NrnhLLQdyjQa69n1Uks1hOMnxkQS7Khs1NIgi18itNZT0F");
            $http.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";
            $http.post("https://api.twitter.com/oauth2/token", {'grant_type': 'client_credentials'})
            .then(function(response) {
                $scope.token = response.data.access_token;
                $scope.bearer = response.data.token_type;
            });
            console.log($scope.token);
        }
        $http.defaults.headers.common['Authorization'] = "Basic "+ $.base64.encode("	O2ByClYuWm6mtGtvo9tu1rr8T"+":"+"0FC4NrnhLLQdyjQa69n1Uks1hOMnxkQS7Khs1NIgi18itNZT0F");
        $http.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";
        $http.get("TwitterTweets17.json")
        .then(function(response) {
            $scope.tweets = response.data;
        });
    }
    
	
    
});

app.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
            if (attrs.src != attrs.errSrc) {
                attrs.$set('src', attrs.errSrc);
            }
            });
        }
    }
});