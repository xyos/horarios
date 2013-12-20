define(['./module'], function (filters) {
  filters.filter('startFrom', function () {
    return function (input, start) {
      start = parseInt(start);
      if (_.isUndefined(input)) {
        return [];
      }
      return input.slice(start);
    };
  });
});