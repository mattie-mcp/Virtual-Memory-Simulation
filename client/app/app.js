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
  $scope.physicalMemory = [];
  $scope.pageTable = [];
  $scope.statsData;
  $scope.currentReference;

  let setup = () => {
    for (let i=0; i<10; i++) {
      $scope.physicalMemory.push({ frame: i, processId: "-", pageNumber: "-" });
      $scope.pageTable.push({ page: i, frame: "-" });
    }
  };
  
  $scope.uploadFile = (file) => {
    file.upload = Upload.upload({
      url: '/startNewProgram',
      data: {
        file: file
      }
    }).then((response) => {
      $scope.statsData = response.data;

      return $http({
        url: '/changeReference',
        method: "GET",
        params: { next: true }
      }).then((successResponse) => {
        $scope.currentReference = successResponse.data;
      }, (failResonse) => {
        console.log('ERROR' + successResponse.status);
        return null;
      });
    });
  };

  setup();

}]);

app.controller('menuController', ['$scope', ($scope) => {
    console.log('loaded menu controller');
}]);
