/* main controller */
app.controller("MainController", ["$scope", "$window", "$location", "smoothScroll",
    function ($scope, $window, $location, smoothScroll) {

        $scope.defaultPage = "pages/home.html"
        $scope.templateUrl = null;
        $scope.hideNav = true;

        $scope.goToPage = function (pageName) {

            $location.url(pageName);
            $scope.templateUrl = "pages" + pageName + ".html";
            
            $scope.goToTop();

            $scope.scrollPageEvent();
        }
        
        $scope.goToTop = function () {
            
            var element = document.getElementById("top");
            smoothScroll(element);
        }

        $scope.scrollPageEvent = function (applyScope) {

            if ($scope.templateUrl !== $scope.defaultPage) {
                $scope.hideNav = false;
            } else {
                if ($window.pageYOffset >= $window.innerHeight * 0.4) {
                    $scope.hideNav = false;
                } else {
                    $scope.hideNav = true;
                }
            }

            if (applyScope === true) {
                $scope.$apply();
            }
        }

        $scope.loadPageEvent = function () {

            if ($location.url() !== "") {
                $scope.goToPage($location.url());
            } else {
                $scope.templateUrl = $scope.defaultPage;
            }
            
            $scope.$apply();

            angular.element($window).bind("scroll", function () {
                $scope.scrollPageEvent(true)
            });
        }

        angular.element($window).bind("load", $scope.loadPageEvent);
    }]);