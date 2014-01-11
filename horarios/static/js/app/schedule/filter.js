define(['./module'], function (filters) {
  filters.filter('startFrom', function () {
    return function (input, start) {
      start = parseInt(start);
      if (angular.isUndefined(input)) {
        return [];
      }
      return input.slice(start);
    };
  });
});