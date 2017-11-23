angular.module('services.loadFile', [])
.service('loadFile', ($http) => {
  return $http({
    url: '/loadFile',
    method: "POST",
    params: { file: {} }
  }).then((successResponse) => {
    console.log('service call succeeded');
    return successResponse;
  }, (failResonse) => {
    console.log('ERROR' + successResponse.status);
    return null;
  });
});