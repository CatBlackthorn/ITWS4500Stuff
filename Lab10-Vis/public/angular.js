var app = angular.module('indexApp', []);

app.controller('tweetRead', function($scope, $http) {
	
	$scope.tweets = [];
    $scope.q = "RPI";
    $scope.count = 10;
    $scope.fileName = "lab8";
    
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
                for (tweet in $scope.tweets) {
                    var oldDate = $scope.tweets[tweet].date;
                    console.log(oldDate);
                    $scope.tweets[tweet].date = "Day: " + oldDate.split("T")[0];
                    $scope.tweets[tweet].date += " Time: " + oldDate.split("T")[1];
                }
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
    
    $scope.getVisualization = function() {
        
        $http({
            method : "GET",
            url : "/visData",
            datatype: "jsonp"
        }).then(function mySuccess(dat) {
            var tweets = dat.data;
            console.log(tweets);
            var ctx = document.getElementById("myChart").getContext('2d');
            var data = []
            // Add to dataset
            var j=0, i = 0;
            while(j < tweets.length) {
                i = 0;
                while(i < tweets[j].tweets.length) {
                    var y = tweets[j].tweets[i].text.split(" ").length;
                    var x = parseInt(tweets[j].tweets[i].created_at.split(" ")[3].split(":")[0]);
                    var curr = '{ "x": ' + x + ', "y":' + y + '} ';
                    data.push(JSON.parse(curr));
                    i++;
                }
                ++j;
                
            }
            console.log(data);
            var myChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    labels: ["00:00:00", "04:00:00", "08:00:00", "12:00:00", "16:00:00", "20:00:00"],
                    datasets: [{
                        label: 'Words at certain times',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                        
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Words in Tweet'
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'TimeInMilitaryHours'
                            }
                        }]
                    }     
                }
                
            });
            
        
            var ctx2 = document.getElementById("myChart2").getContext('2d');
            var data2 = []
            // Add to dataset
            var j=0, i = 0;
            while(j < tweets.length) {
                i = 0;
                while(i < tweets[j].tweets.length) {
                    var y = tweets[j].tweets[i].user.followers_count;
                    var x = tweets[j].tweets[i].user.friends_count;
                    var curr = '{ "x": ' + x + ', "y":' + y + '} ';
                    data2.push(JSON.parse(curr));
                    i++;
                }
                ++j;
                
            }
            console.log(data2);
            var myChart = new Chart(ctx2, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Friends versus Followers',
                        data: data2,
                        backgroundColor: [
                            'rgba(255, 99, 132)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                        
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Followers'
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                type: 'linear',
                                stepSize: 100,
                                labelString: 'Friends',
                                minimum: 0,
                                maximum: 5000,
                                inerval: 100
                            }
                        }]
                    }     
                }
                
            });
            
           
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
            location.reload();
        });
        
        
    }
    
    $scope.getPage = function() {
        $http({
                method : "GET",
                url : "/page"
            }).then(function mySuccess(response) {
                window.location.href = '/page'
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
                location.reload();
            });
    }
    
    $scope.getVis = function() {
        $http({
                method : "GET",
                url : "/visual"
            }).then(function mySuccess(response) {
                window.location.href = '/visual'
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
                location.reload();
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