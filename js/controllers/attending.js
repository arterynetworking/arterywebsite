/* attending controller */
app.controller("AttendingController", ["$scope", "attendanceData",
    function ($scope, attendanceData) {

        $scope.attendees = [];
        $scope.searchText = "";

        attendanceData.fetch().then(function (data) {
            $scope.attendees = data;
        });
    }]);

app.factory('attendanceData', function ($timeout, $http) {
    var attendanceData = {
        fetch: function () {
            return $timeout(function () {
                return $http.get('./js/data/attendees.json').then(function (response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return attendanceData;
});