/* global angular */
var app = angular.module("arteryWebApp", []);

app.directive("mapscroll", function ($document) {
    return function (scope, element, attrs) {
        
        /* Enable map scroll upon click of maps. */
        element.on("click", function () {
            element.find("iframe").addClass("enable-pointer");
        });
        
        /* Disable map scroll when mouse leaves maps. */
        element.on("mouseleave", function () {
            element.find("iframe").removeClass("enable-pointer");
        });
    }
});