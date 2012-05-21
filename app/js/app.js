'use strict';

// Declare app level module which depends on directives and services
angular.module('imageGallery', ['imageGallery.services', 'imageGallery.directives']).
  config(['$routeProvider', function($routeProvider) {
    //this isn't strictly needed, as there is only a single route
    $routeProvider.when('/', {template: 'partials/gallery_partial.html', controller: GalleryController});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
