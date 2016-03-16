/* home controller */
app.controller("HomeController", ["$scope", "smoothScroll",
    function ($scope, smoothScroll) {
        
        $scope.goToTickets = function () {
            
            var element = document.getElementById("tickets");
            smoothScroll(element);
        }
    }]);