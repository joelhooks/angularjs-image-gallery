(function($) {
    'use strict';
    var directives = angular.module('imageGallery.directives', []);

    directives.directive('fullImage', function() {
        return {
            restrict: 'E',
            scope: {
                imgSrc: '&'
            },
            // The linking function will add behavior to the template
            link: function(scope, element, attrs) {
                scope.$watch("imgSrc()", function(newVal, oldVal) {
                    //re-render the template each time "imgSrc()" changes
                    element.html('<img src="'+ newVal.fullsizeUrl +'" class="image">');
                });
            }
        }
    });

    directives.directive('thumbImage', function() {
        return {
            restrict: 'E',
            scope: {
                imgSrc: '&'
            },
            link: function(scope, element, attrs) {
                var photoIndex = scope.$parent.$index,
                    photoElement = $(element),
                    photoX;
                scope.photo = scope.$parent.photo;
                photoElement.html('<img src=' + scope.photo.thumbUrl + '>');

                scope.$watch("imgSrc()", function(newVal) {
                    var allThumbElems = $.makeArray($("div").find("thumb-image")),
                        isSelected = newVal === scope.photo,
                        index;

                    if(isSelected) {
                        photoIndex = 0;
                        //remove the selected class from previously selected item
                        for(index = 0 ; index < allThumbElems.length; index++) {
                            $(allThumbElems[index]).removeClass("selected")
                        }
                        photoElement.addClass("selected");
                    } else if ( photoIndex < newVal.index ) {
                        photoIndex = photoIndex + 1;
                        scope.photo.index = photoIndex;
                    }

                    function animate() {

                        var first = $(allThumbElems[0]),
                            last = $(allThumbElems[allThumbElems.length - 1]),
                            selectedX= photoElement.position().left + 75,
                            deltaX = selectedX - 500;

                        first.css({left:first.position().left - Math.floor(deltaX / 3)});

                        for (index = 1; index < allThumbElems.length; index++) {
                            var currentThumb = $(allThumbElems[index]);
                            var previousThumb = $(allThumbElems[index-1]);
                            currentThumb.css({left: previousThumb.position().left + 77})
                        }

                        if (first.position().left < 0 - 75 && !first.hasClass("selected")) {
                            // moves clips from first to last
                            allThumbElems.push(allThumbElems.shift());
                            first.css({left:last.position().left + 75});
                        }

                        if (last.position().left > (75 * allThumbElems.length) - (25) && !last.hasClass("selected")) {
                            // moves clips from last to first
                            allThumbElems.unshift(allThumbElems.pop());
                            last.css({left:first.position().left - 75})
                        }

                        $('#thumbContainer').prepend(allThumbElems);

                        if(Math.abs(deltaX) > 2) {
                            setTimeout(animate, 40);
                        }
                    }

                    if(isSelected) {
                        animate();
                    }
                });
            }
        }
    })
}(jQuery));

