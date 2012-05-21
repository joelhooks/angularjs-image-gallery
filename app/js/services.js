(function() {
    'use strict';

    var services = angular.module('imageGallery.services', ['ngResource'], [
            '$httpProvider', function($httpProvider) {
                $httpProvider.responseInterceptors.push('interceptor');
        } ]);

    var getImageUrl = function (size, photo) {
        var size_code;
        switch (size) {
            case 'square': size_code = '_s'; break; // 75x75
            case 'medium': size_code = '_z'; break; // 640 on the longest side
            case 'large': size_code = '_b'; break; // 1024 on the longest side
            default: size_code = '';
        }
        return "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + size_code + ".jpg";
    };

    var processFlickrResults = function(response) {
        if(response.data && response.data.hasOwnProperty("photos")) {
            var photos = response.data.photos.photo;
            for(var i = 0;i < photos.length; i++) {
                //add some convenient properties to the photo objects
                var photo = photos[i];
                photo.thumbUrl = getImageUrl('square', photo);
                photo.fullsizeUrl = getImageUrl('large', photo);
                photo.index = i;
            }
            response.data.photos = photos;
        }

        return response;
    };

    services.factory('interceptor', function($q) {
        return function(promise) {
            return promise.then(function(response) {
                return processFlickrResults(response);
            });
        }
    });

    services.factory('PhotoService', function($resource) {
        return $resource('http://api.flickr.com/services/rest/', {
            api_key : '7617adae70159d09ba78cfec73c13be3',
            format : 'json',
            method: 'flickr.interestingness.getList',
            per_page : 24,
            page : 1,
            jsoncallback:'JSON_CALLBACK'
        }, {
            query: {method:'JSONP'}
        });
    });

    services.factory('PreloadService', function() {
        return {
            imageClass: Image,
            preload: function(photos) {
                var self = this;
                var preloadUrls = [],
                    count = 0,
                    i;

                for(i = 0;i < photos.length; i++) {
                    if(i != 0)
                        preloadUrls.push(photos[i].fullsizeUrl);
                }

                preloadUrls.map(function(url) {
                    var image = new self.imageClass();
                    image.src = url;
                    count++;
                });

                return count;
            }
        }
    });

    services.factory('GalleryImagesModel', function() {
        return [];
    });
}());



