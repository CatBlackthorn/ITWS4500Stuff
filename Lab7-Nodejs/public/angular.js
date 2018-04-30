var app = angular.module('indexApp', []);

app.controller('tweetRead', function($scope, $http) {
	
	$scope.tweets = [];
    $scope.q = "RPI";
    $scope.count = 10;
    $scope.fileName = "lab7";
    
    $scope.search = function(e) {
        if ($scope.q === "") {
            $scope.q = "-73.68,42.72,50mi";
        }
        if (e.target.name === "search") {
            $http({
                method : "POST",
                url : "/search",
                params: {"q":$scope.q, "count":$scope.count}
            }).then(function mySuccess(response) {
                console.log($scope.tweets);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        } else if (e.target.name == "export") {
            var types = document.getElementById("types");
            var type = types.options[types.selectedIndex].value;
            console.log(type);
            $http({
                method : "GET",
                url : "/export",
                datatype: "jsonp",
                params: {"name":$scope.fileName, "format":type}
            }).then(function mySuccess(response) {
                alert(response.data);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        } else if (e.target.name == "display") {
            $http({
                method : "GET",
                url : "/tweets",
                datatype: "jsonp",
                params: {"q":$scope.q, "count":$scope.count}
            }).then(function mySuccess(response) {
                $scope.tweets = response.data;
                console.log($scope.tweets);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        } else if (e.target.name == "delete") {
            $http({
                method : "GET",
                url : "/delete",
                datatype: "jsonp"
            }).then(function mySuccess(response) {
                alert(response.data);
                location.reload();
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
                location.reload();
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