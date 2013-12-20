define(['./module'], function (filters) {
  'use strict';
  filters.filter('humanize', function () {
    function humanize(text) {
      return text.toLowerCase().replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });
    }
    return function (text) {
      if(angular.isString(text)){
        return humanize(text);
      } else {
        return text;
      }
    };
  });
});