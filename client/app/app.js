
var app = angular.module('app', [
  'ngRoute',
  'ngFileUpload'
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
  $scope.physicalMem = [];  // State of physical memory
  $scope.pageTable = [];    // All page tables for all processes
  $scope.statsData;         // Statistics data
  $scope.progress = {};     // Information on progress through program
  $scope.isPaused = true;   // Start program in pause state
  $scope.speed = 2000;      // Default step through speed
  $scope.isFileUploaded = false;

  /**
   * Checks to see if all memory references have been read
   */
  const isDone = () => {
    if (!$scope.progress || $scope.progress.current == null || $scope.progress.max == null) {
      return false;
    }
    return $scope.progress.current === $scope.progress.max;
  };

  /**
   * Resets state of program
   */
  const reset = () => {
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

  /**
   * Steps through the program automatically
   * @param {int} ms Milliseconds to wait before moving to next references
   */
  $scope.play = (ms) => {
    if ($scope.isPaused == false && !isDone()) {
      $scope.step(1);
      setTimeout(() => {
        $scope.play(ms);
      }, ms);
    }
  };

  /**
   * 
   * @param {bool} pause Indicates desired state of pause
   * @param {int} stepSpeed (optional) speed at which program should be stepped through
   */
  $scope.togglePause = (pause, stepSpeed) => {
    $scope.isPaused = pause;
    if (pause == false) {
      $scope.play(stepSpeed == null ? $scope.speed : stepSpeed);
    }
  };

  /**
   * Continues to step through program until next page fault
   */
  $scope.playUntilPageFault = () => {
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
          return;
        }
      });
  };

  /**
   * Moves to next memory reference
   * @param {int} action 1 or -1, 1 indicating the program should move forward
   */
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

  /**
   * Retrieves state of program in order to update UI
   */
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
  
  /**
   * Kicks off execution of new memory references
   * @param {Object} file FIle to upload
   */
  $scope.uploadFile = (file) => {
    reset();
    file.upload = Upload.upload({
      url: '/startNewProgram',
      data: {
        file: file
      }
    }).then((response) => {
      $scope.isFileUploaded = true;
      $scope.togglePause(false);      
    });
  };

}]);

app.controller('menuController', ['$scope', ($scope) => {
}]);
