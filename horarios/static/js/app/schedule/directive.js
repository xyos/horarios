define(['./module'], function (directives) {
    directives.directive('aDisabled', function ($compile) {
        return {
            restrict: 'A',
            priority: -99999,
            link: function (scope, element, attrs) {
                var oldNgClick = attrs.ngClick;
                if (oldNgClick) {
                    scope.$watch(attrs.aDisabled, function (val, oldval) {
                        if (!!val) {
                            element.unbind('click');
                        } else if (oldval) {
                            attrs.$set('ngClick', oldNgClick);
                            element.bind('click', function () {
                                scope.$apply(attrs.ngClick);
                            });
                        }
                    });
                }
            }
        };
    });
});