var app = angular.module('indexApp', []);

app.controller('tweetRead', function($scope, $http) {
	
	$scope.tweets = [];
    $scope.q = "RPI";
    $scope.count = 10;
    var e = document.getElementById("types");
    var type = e.options[e.selectedIndex].value;
    
    $scope.search = function(e) {
        if ($scope.q === "") {
            $scope.q = "-73.68,42.72,50mi";
        }
        if (e.target.name === "search") {
            $http({
                method : "GET",
                url : "/tweets",
                datatype: "jsonp",
                params: {"q":$scope.q, "count":$scope.count}
            }).then(function mySuccess(response) {
                $scope.tweets = response.data.statuses;
                console.log($scope.tweets);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        } else if (e.target.name == "export") {
            $http({
                method : "GET",
                url : "/export",
                datatype: "jsonp",
                params: {"q":$scope.q, "count":$scope.count, "format":type}
            }).then(function mySuccess(response) {
                alert(response.data);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        }
        
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