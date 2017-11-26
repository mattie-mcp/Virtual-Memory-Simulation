var app = angular.module('app', [
  'ngRoute',
  'ngFileUpload',
  'services.loadFile'
]);

app.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({ enabled: true, requireBase: false});
    $routeProvider
      .when('/', {
        templateUrl: '/index.html',
        controller: 'appController'
      });
}]);

app.controller('appController', ['$scope', '$http', 'Upload', ($scope, $http, Upload) => {
  $scope.memReferences = [];
  $scope.physicalMem = [];
  $scope.pageTable = [];
  $scope.statsData;
  $scope.progress = {};
  //$scope.currentReference;
  $scope.isPaused = false;

  $scope.step = (action) => {
    return $http({
      url: '/nextReference',
      method: "GET",
      params: { next: action == 1, previous: action == -1 }
    }).then((successResponse) => {
      console.log(successResponse.data);
      $scope.currentReference = successResponse.data;
      $scope.getState();
    }, (failResonse) => {
      console.log('ERROR' + successResponse.status);
      return null;
    });
  };

  $scope.getState = () => {
    return $http({
      url: '/getState',
      method: "GET",
      params: { processName: $scope.currentReference == null ? null : $scope.currentReference.process }
    }).then((successResponse) => {
      console.log(successResponse.data);
      $scope.pageTable = successResponse.data.pageTable.pages;
      $scope.physicalMem = successResponse.data.physicalMem;
      $scope.progress = successResponse.data.progress;
      $scope.statsData = successResponse.data.processStats;
    }, (failResonse) => {
      console.log('ERROR' + successResponse.status);
      return null;
    });
  };
  
  $scope.uploadFile = (file) => {
    file.upload = Upload.upload({
      url: '/startNewProgram',
      data: {
        file: file
      }
    }).then((response) => {
      $scope.step(1);
      // $scope.currentReference = response.data.currentReference;
      
    });
  };

}]);

app.controller('menuController', ['$scope', ($scope) => {
    console.log('loaded menu controller');
}]);
