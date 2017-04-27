var testResizeCtrl = (function () {
	'use strict';

	angular
		.module('bzTest')
		.controller('testResizeCtrl', testResizeCtrl);

	function testResizeCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, $filter,
		NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, Upload, testSvc) {
		var vmTestResize = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/

		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmTestResize.thumbImgPath = settingJs.configs.uploadDirectory.thumb;
		vmTestResize.tempImgPath = settingJs.configs.uploadDirectory.tmp;


		vmTestResize.image = {
			old: null,
			new: null
		}
		vmTestResize.formData = {
			height: 300,
			width: 300,
			name: null,
		}
		vmTestResize.uploadImage = uploadImage;
		vmTestResize.resize = resize;
		vmTestResize.crop = crop;

		// Methods

		function crop() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/cropper/view.html',
				controller: function ($scope, $uibModalInstance) {
					var popupScope = this;
					$scope.popupScope = {
						// image : 'http://muahangviet.local/files/banner_image/banner_image_1490065477542.png',
						event: 'crop:image',
						ratio: 3/4,
						width: 300,
						height: 400,
						// mimeType : 'image/jpeg'
					};
					$scope.$on('crop:image', function (event, res) {
						console.log('image', res);
						testSvc.uploadBase64({ directory: 'avatar', image: res.image }).then(function (resp) {
							console.log('success uplaod', resp);
						}).catch(function (err) {
							console.log('Error upload: ', err);
						});

					});
				}
			});
		}

		function resize() {
			testSvc.resize(vmTestResize.formData).then(function (resp) {
				vmTestResize.image.new = resp;
			}).catch(function (err) {
				console.log('err', err);
			})
		}

		function uploadImage(file) {
			if (file.length > 0) {
				if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
					Upload.upload({
						url: $window.settings.services.uploadApi + '/upload/file',
						data: {
							file: file[0],
							type: 'tmp',
							prefix: 'test_img',
						}
					}).then(function (resp) {
						console.log(resp);
						vmTestResize.image.old = resp.data;
						vmTestResize.formData.name = vmTestResize.image.old.filename;
					}, function (resp) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Lỗi!',
								message: resp.message
							}
						});
					}, function (evt) {
						$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					});
				}
				else {
					alert("Hỉnh ảnh phải có định dạng là jpg, png hoặc gif!");
					return;
				}
			}
		}
	}
	var resolve = {
		/* @ngInject */
		preload: function (bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve: resolve
	};
})();