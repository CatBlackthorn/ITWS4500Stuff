var app = angular.module('indexApp', []);

app.controller('tweetRead', function($scope, $http) {
	
	$scope.tweets = [];
    $scope.q = "RPI";
    $scope.count = 10;
    
    $scope.search = function() {
        if ($scope.q === "") {
            $scope.q = "-73.68,42.72,50mi";
        }
        $http({
            method : "GET",
            url : "http://localhost:3000/tweets",
            datatype: "jsonp",
            params: {"q":$scope.q, "count":$scope.count,}
        }).then(function mySuccess(response) {
            $scope.tweets = response.data.statuses;
            console.log($scope.tweets);
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
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