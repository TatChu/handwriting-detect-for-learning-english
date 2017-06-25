; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('recognitionDataCtrl', recognitionDataCtrl);

	function recognitionDataCtrl($scope, $filter, $rootScope, $state, $window, $bzPopup, $uibModal, customResourceSrv, userSvc, bzUpload, authSvc, userSvcApi) {
		var vmRecognition = this;
		vmRecognition.arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

		vmRecognition.userFolder = $window.userFolder;
		vmRecognition.menuActive = 'recognition';
		vmRecognition.isAllowRequest = false;
		vmRecognition.userFolder.user.file_input = $filter('orderBy')(vmRecognition.userFolder.user.file_input, 'toString()', false)

		// METHOD
		vmRecognition.uploadImage = uploadImage;
		vmRecognition.checkDataItem = checkDataItem;
		vmRecognition.getLinkItem = getLinkItem;
		vmRecognition.getImage = getImage;
		vmRecognition.checkIsAllowRequest = checkIsAllowRequest;
		vmRecognition.requestRecogniton = requestRecogniton;
		// Init
		checkIsAllowRequest();

		// FUNCTION
		function checkIsAllowRequest() {
			var isAllowRequest = true;
			vmRecognition.arraysChart.forEach(function (character) {
				if (getImage(character) == null) {
					isAllowRequest = false;
				}
			});
			vmRecognition.isAllowRequest = isAllowRequest;
			return isAllowRequest;
		}

		function checkDataItem(character, index) {
			var img = getImage(character);
			if (img) return true;
			else
				return false;
		}

		function getLinkItem(character, index) {
			var img = getImage(character);
			var prefixLink = vmRecognition.userFolder.user.input.split('').splice(6, vmRecognition.userFolder.user.input.length).join('');
			return prefixLink + img;
		}

		function getImage(character) {
			var img = null;
			vmRecognition.userFolder.user.file_input.forEach(function (item) {
				if (item[0] == character) {
					img = item;
				}
			});
			return img;
		}
		function uploadImage(item) {
			var cropModal = $uibModal.open({
				animation: true,
				templateUrl: '/assets/global/cropper/view.html',
				controller: function ($scope, $uibModalInstance) {
					var popupScope = this;
					$scope.popupScope = {
						event: 'crop:image',
						ratio: 1,
						width: 300,
						height: 300,
					};
					$scope.$on('crop:image', function (event, res) {
						var data = {
							image: res.image,
							character: item,
							directory: vmRecognition.userFolder.user.input
						}
						bzUpload.uploadDataTraning(data).then(function (resp) {
							vmRecognition.userFolder.user.file_input.push(resp.name);
							$uibModalInstance.close();
							// location.reload();
						}).catch(function (err) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi',
									message: err.message
								}
							});
						})
					});
				}
			});
		}

		function requestRecogniton() {
			if (checkIsAllowRequest()) {
				userSvcApi.requestRecogniton().then(function (resp) {
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'Thành công',
							message: resp.message
						}
					});
				}).catch(function (err) {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Thất bại',
							message: err.data.messageF
						}
					});
					console.log(err);
				});
			}
		}
	}
})();