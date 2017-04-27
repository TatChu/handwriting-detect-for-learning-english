(function(){
	'use strict';
	angular
	.module('bzApp')
	.directive('bzCropper', bzCropper);

	function bzCropper($state, $timeout){
		return {
			replace: true,
			templateUrl: 'modules/popup/cropper/crop.html',
			link: function (scope, iElement, iAttrs) {
				var cropper = null,
				flipCircle = 0,
				fileInput = iElement.find('#cropper-input-file'),
				imgCrop = iElement.find('#cropper-img');

				scope.showButtonCrop = false;
				scope.loading = false;

				scope.getImage = getImage;
				scope.setImage = setImage;
				scope.fileTrigger = fileTrigger;
				scope.zoom = zoom;
				scope.rotate = rotate;
				scope.scale = scale;

				scope.$on('$destroy', function(){
					cropper.cropper('destroy');
				});

				if(iAttrs.cropImage){
					scope.loading = true;
					imgCrop[0].crossOrigin = 'anonymous';
					imgCrop[0].src = iAttrs.cropImage;

					$timeout(function(){
						scope.showButtonCrop = true;
						initCropper();
					},1000);

				} else {
					initCropper();
				}

				function fileTrigger(){
					fileInput.click();
				}

				function zoom(val){
					cropper.cropper('zoom', val);
				}

				function rotate(val){
					if(val){
						cropper.cropper('rotate', val);
					} else {
						cropper.cropper('rotate', 90)
					}
				}

				function scale(val){
					if(val){
						cropper.cropper('scale', val);
					} else {
						flipCircle++;
						switch(flipCircle){
							case 1: cropper.cropper('scale', -1,1); break;
							case 2: cropper.cropper('scale', 1,-1); break;
							case 3: cropper.cropper('scale', -1,-1); break;
							case 4: cropper.cropper('scale', 1,1); flipCircle = 0; break;
						}
					}
				}

				function initCropper(){
					cropper = imgCrop.cropper({
						aspectRatio: iAttrs.cropRatio,
						guides: false
					});
					scope.loading = false;
				}

				function setImage(obj) {
					var URL = window.URL || window.webkitURL,
					blobURL;

					if (URL) {
						blobURL = URL.createObjectURL(obj.files[0]);
						imgCrop.one('built.cropper', function () {
							URL.revokeObjectURL(blobURL);
						}).cropper('reset').cropper('replace', blobURL);

						scope.$apply(function(){
							scope.showButtonCrop = true;
						});
					}
				}

				function getImage(){
					var canvasData = cropper.cropper('getCroppedCanvas', {
						width: iAttrs.cropWidth,
						height: iAttrs.cropHeight
					});

					var imgCropped = canvasData.toDataURL(iAttrs.cropMime);

					scope.$root.$broadcast(iAttrs.cropEvent, {image:imgCropped});
				}
			}
		};
	}
})();