
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
  $scope.isPaused = true;
  $scope.speed = 2000;

  const isDone = () => {
    if (!$scope.progress || $scope.progress.current == null || $scope.progress.max == null) {
      return false;
    }
    return $scope.progress.current === $scope.progress.max;
  };

  const reset = () => {
    
    $scope.memReferences = [];
    $scope.physicalMem = [];
    $scope.pageTable = [];
    $scope.statsData;
    $scope.progress = {};
    $scope.isPaused = true;
    $scope.speed = 2000;

    return $http({
      url: '/reset',
      method: "POST",
      params: { }
    }).then(() => {
      return;
    }, (failResonse) => {
      console.log('ERROR' + failResonse.status);
      return null;
    });
  };

  $scope.play = (ms) => {
    if ($scope.isPaused == false && !isDone()) {
      $scope.step(1);
      setTimeout(() => {
        $scope.play(ms);
      }, ms);
    }
  };

  $scope.togglePause = (pause, stepSpeed) => {
    $scope.isPaused = pause;
    if (pause == false) {
      console.log(stepSpeed);
      console.log($scope.speed);
      $scope.play(stepSpeed == null ? $scope.speed : stepSpeed);
    }
  };

  $scope.playUntilPageFault = () => {
    console.log('step');
    if (isDone()) {
      return;
    }
    $scope.isPaused = true;
    $scope.step(1)
      .then(() => {
        if (!$scope.currentReference.pageFault || $scope.currentReference.pageFault != true) {
          $scope.playUntilPageFault();
        }
        else {
          console.log('page fault');
          return;
        }
      });
  };

  $scope.step = (action) => {
    if (isDone()) {
      return;
    }
    return $http({
      url: '/nextReference',
      method: "GET",
      params: { next: action == 1, previous: action == -1 }
    }).then((successResponse) => {
      console.log(successResponse.data);
      $scope.currentReference = successResponse.data;
      return $scope.getState();
    }, (failResonse) => {
      console.log('ERROR' + failResonse.status);
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
      $scope.pageTables = successResponse.data.pageTables;
      $scope.physicalMem = successResponse.data.physicalMem;
      $scope.progress = successResponse.data.progress;
      $scope.statsData = successResponse.data.processStats;
      return successResponse.data;
    }, (failResonse) => {
      console.log('ERROR' + successResponse.status);
      return null;
    });
  };
  
  $scope.uploadFile = (file) => {
    reset();
    file.upload = Upload.upload({
      url: '/startNewProgram',
      data: {
        file: file
      }
    }).then((response) => {
      $scope.togglePause(false);
      // $scope.currentReference = response.data.currentReference;
      
    });
  };

}]);

app.controller('menuController', ['$scope', ($scope) => {
    console.log('loaded menu controller');
}]);
