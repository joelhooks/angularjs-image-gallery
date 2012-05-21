function GalleryController($scope, PhotoService, PreloadService) {

    $scope.selectedImage = {fullsizeUrl:"assets/clear.png"};

    $scope.photos = [];

    $scope.processResults = function(data) {
        $scope.photos = data.photos;
        if($scope.photos.length > 0) {
            $scope.selectedImage = $scope.photos[0];
        }
        PreloadService.preload($scope.photos);
    };

    $scope.getPhotos = function() {
        PhotoService.query($scope.processResults);
    };

    $scope.selectImg = function(data) {
        $scope.selectedImage = data;
    };

    $scope.getPhotos();
}

GalleryController.$inject = ['$scope', 'PhotoService', 'PreloadService'];
