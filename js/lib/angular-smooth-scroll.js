
var smoothScroll = function (element, options) {
    options = options || {};

    // Options
    var duration = options.duration || 800,
        offset = options.offset || 0,
        easing = options.easing || 'easeInOutQuart',
        callbackBefore = options.callbackBefore || function () { },
        callbackAfter = options.callbackAfter || function () { },
        container = document.getElementById(options.containerId) || null,
        containerPresent = (container != undefined && container != null);

    var getScrollLocation = function () {
        if (containerPresent) {
            return container.scrollTop;
        } else {
            if (window.pageYOffset) {
                return window.pageYOffset;
            } else {
                return document.documentElement.scrollTop;
            }
        }
    };

    var getEasingPattern = function (type, time) {
        switch (type) {
            case 'easeInQuad': return time * time; // accelerating from zero velocity
            case 'easeOutQuad': return time * (2 - time); // decelerating to zero velocity
            case 'easeInOutQuad': return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
            case 'easeInCubic': return time * time * time; // accelerating from zero velocity
            case 'easeOutCubic': return (--time) * time * time + 1; // decelerating to zero velocity
            case 'easeInOutCubic': return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
            case 'easeInQuart': return time * time * time * time; // accelerating from zero velocity
            case 'easeOutQuart': return 1 - (--time) * time * time * time; // decelerating to zero velocity
            case 'easeInOutQuart': return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
            case 'easeInQuint': return time * time * time * time * time; // accelerating from zero velocity
            case 'easeOutQuint': return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
            case 'easeInOutQuint': return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
            default: return time;
        }
    };

    var getEndLocation = function (element) {
        var location = 0;
        if (element.offsetParent) {
            do {
                location += element.offsetTop;
                element = element.offsetParent;
            } while (element);
        }
        location = Math.max(location - offset, 0);
        return location;
    };

    setTimeout(function () {
        var currentLocation = null,
            startLocation = getScrollLocation(),
            endLocation = getEndLocation(element),
            timeLapsed = 0,
            distance = endLocation - startLocation,
            percentage,
            position,
            scrollHeight,
            internalHeight;

        var stopAnimation = function () {
            currentLocation = getScrollLocation();
            if (containerPresent) {
                scrollHeight = container.scrollHeight;
                internalHeight = container.clientHeight + currentLocation;
            } else {
                scrollHeight = document.body.scrollheight;
                internalHeight = window.innerHeight + currentLocation;
            }

            if (
                ( // condition 1
                    position == endLocation
                    ) ||
                ( // condition 2
                    currentLocation == endLocation
                    ) ||
                ( // condition 3
                    internalHeight >= scrollHeight
                    )
                ) { // stop
                clearInterval(runAnimation);
                callbackAfter(element);
            }
        };

        var animateScroll = function () {
            timeLapsed += 16;
            percentage = (timeLapsed / duration);
            percentage = (percentage > 1) ? 1 : percentage;
            position = startLocation + (distance * getEasingPattern(easing, percentage));
            if (containerPresent) {
                container.scrollTop = position;
            } else {
                window.scrollTo(0, position);
            }
            stopAnimation();
        };

        callbackBefore(element);
        var runAnimation = setInterval(animateScroll, 16);
    }, 0);
};

app.factory('smoothScroll', function () {
    return smoothScroll;
});

app.directive('smoothScroll', ['smoothScroll', function (smoothScroll) {
    return {
        restrict: 'A',
        scope: {
            callbackBefore: '&',
            callbackAfter: '&',
        },
        link: function ($scope, $elem, $attrs) {
            if (typeof $attrs.scrollIf === 'undefined' || $attrs.scrollIf === 'true') {
                setTimeout(function () {

                    var callbackBefore = function (element) {
                        if ($attrs.callbackBefore) {
                            var exprHandler = $scope.callbackBefore({ element: element });
                            if (typeof exprHandler === 'function') {
                                exprHandler(element);
                            }
                        }
                    };

                    var callbackAfter = function (element) {
                        if ($attrs.callbackAfter) {
                            var exprHandler = $scope.callbackAfter({ element: element });
                            if (typeof exprHandler === 'function') {
                                exprHandler(element);
                            }
                        }
                    };

                    smoothScroll($elem[0], {
                        duration: $attrs.duration,
                        offset: $attrs.offset,
                        easing: $attrs.easing,
                        callbackBefore: callbackBefore,
                        callbackAfter: callbackAfter,
                        containerId: $attrs.containerId
                    });
                }, 0);
            }
        }
    };
}]);

app.directive('scrollTo', ['smoothScroll', function (smoothScroll) {
    return {
        restrict: 'A',
        scope: {
            callbackBefore: '&',
            callbackAfter: '&',
        },
        link: function ($scope, $elem, $attrs) {
            var targetElement;

            $elem.on('click', function (e) {
                e.preventDefault();

                targetElement = document.getElementById($attrs.scrollTo);
                if (!targetElement) return;

                var callbackBefore = function (element) {
                    if ($attrs.callbackBefore) {
                        var exprHandler = $scope.callbackBefore({ element: element });
                        if (typeof exprHandler === 'function') {
                            exprHandler(element);
                        }
                    }
                };

                var callbackAfter = function (element) {
                    if ($attrs.callbackAfter) {
                        var exprHandler = $scope.callbackAfter({ element: element });
                        if (typeof exprHandler === 'function') {
                            exprHandler(element);
                        }
                    }
                };

                smoothScroll(targetElement, {
                    duration: $attrs.duration,
                    offset: $attrs.offset,
                    easing: $attrs.easing,
                    callbackBefore: callbackBefore,
                    callbackAfter: callbackAfter,
                    containerId: $attrs.containerId
                });

                return false;
            });
        }
    };
}]);