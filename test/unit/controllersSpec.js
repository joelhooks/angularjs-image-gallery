'use strict';

/* jasmine specs for controllers go here */

describe('GalleryController', function() {
    var scope, ctrl, mockPhotoService, mockPreloadService;

    beforeEach(inject(function($rootScope, $controller) {
        mockPhotoService = {
            query: function(callback) {
                this.wasCalled = true;
                var value = this.returnValue;
                callback.call(this, {photos: value});
                return value;
            },
            returnValue: [{}, {}],
            wasCalled: false
        };

        mockPreloadService = {
            preload: function (photos) {
                this.wasCalled = true;
                return photos.length;
            },
            wasCalled: false
        }
        scope = $rootScope.$new();
        ctrl = $controller(GalleryController, {$scope: scope, PhotoService: mockPhotoService, PreloadService: mockPreloadService});
    }));

    describe('selectImg', function() {
        it('should set selectedImage when selectImg is called on the scope', function() {
            var data = {fullsizeUrl:"path/to/nowhere"};
            scope.selectImg(data);
            expect(scope.selectedImage.fullsizeUrl).toEqual(data.fullsizeUrl);
        });
    });

    describe('getPhoto', function() {
        it('should be called when initialized', function() {
            expect(scope.photos.length).toBeGreaterThan(0);
        });

        it('should query PhotoService', function() {
            scope.getPhotos();
            expect(mockPhotoService.wasCalled).toBeTruthy();
        });

        it('should process results', function() {
            scope.getPhotos();

            expect(mockPreloadService.wasCalled).toBeTruthy();
        })
    });

    describe('processResults', function() {
        it('should populate photos with data', function() {
            var photos = [{}];
            scope.processResults({photos: photos});
            expect(scope.photos).toBe(photos);
        });

        it('should set first photo as selectedPhoto', function() {
            var photo = {};
            var photos = [photo];
            scope.processResults({photos: photos});

            expect(scope.selectedImage).toBe(photo);
        });

        it('should call preload service', function() {
            var photos = [{}];
            scope.processResults({photos: photos});

            expect(mockPreloadService.wasCalled).toBeTruthy();
        })
    })
});

