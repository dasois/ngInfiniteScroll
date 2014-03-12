/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = (value.toString() === "false");
//                        if (scrollEnabled && checkWhenEnabled) {
//                            checkWhenEnabled = false;
//                            return handler();
//                        }
                    });
                }
                handler = function () {
                    if (scrollEnabled === true) {
                        var elementBottom, remaining, shouldScroll, windowBottom;
                        windowBottom = $window[0].innerHeight + $window[0].scrollY;
                        elementBottom = elem[0].offsetTop + elem[0].offsetHeight;
                        remaining = elementBottom - windowBottom;
                        shouldScroll = remaining <= $window[0].innerHeight * scrollDistance;
                        if (shouldScroll === true) {
                            //          if($window[0].scrollTop + $window[0].offsetHeight >= $window[0].scrollHeight) {
                            if ($rootScope.$$phase) {
                                return scope.$eval(attrs.infiniteScroll);
                            } else {
                                return scope.$apply(attrs.infiniteScroll);
                            }
                            /*} else if (shouldScroll) {
                             return checkWhenEnabled = true;*/
                        }
                    }
                };
                $window.bind('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout(function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }, 0);
            }
        };
    }
]);
