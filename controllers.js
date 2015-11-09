//controllers
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){
    
    $scope.city = cityService.city;
    
    $scope.$watch('city', function(){
       cityService.city = $scope.city;                                      
    });

}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService){
    
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || "2";
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{
        callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}});
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days, appid: "61806b89c97fb46ae7a95a9ba074c1a3"});
    
    $scope.convertToFahrenheit = function(degK){
        return Math.round((1.8 * (degK - 273)) + 32);
    }
    
    $scope.convertToDate = function(dt){
        return new Date(dt * 1000);
    }
    
}]);

weatherApp.controller("LineCtrl", ['$scope', '$resource', '$filter', 'cityService', function ($scope, $resource, $filter, cityService) {

    $scope.city = cityService.city;
    $scope.days = 7;
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{
        callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}});
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days, appid: "61806b89c97fb46ae7a95a9ba074c1a3", units: "imperial"});
    //day temp
    $scope.data = [];
    $scope.labels = [];
    $scope.tempData = [];
    $scope.tempData1 = [];
    $scope.tempLabels = [];
    $scope.weatherResult.$promise.then(function(results){
        console.log(results);
        for(i=0;i < results.list.length;i++){
//            console.log(results.list[i].pressure);
            $scope.tempData.push(results.list[i].temp.max); 
            $scope.tempData1.push(results.list[i].temp.min);
            $scope.convertToDate = function(dt){
                return new Date(dt * 1000);
            }
            $scope.tempdate = $scope.convertToDate(results.list[i].dt); 
            $scope.formattedTempDate = $filter('date')($scope.tempdate, 'MMM d, y')
              
            $scope.tempLabels.push($scope.formattedTempDate);
        }
                
        $scope.data.push($scope.tempData,$scope.tempData1);
        
//        $scope.labels.push($scope.convertToDate($scope.tempTemp).toString());
//        console.log(results.list.pressure);
    });
    
    
    $scope.labels = $scope.tempLabels;
   
    
    $scope.series = ['Maximum Temperature', 'Minimum Temperature'];

//    $scope.onClick = function (points, evt) {
//    console.log(points, evt);
//    };
}]);