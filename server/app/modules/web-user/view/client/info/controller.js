; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('userInfoCtrl', userInfoCtrl);

	function userInfoCtrl($scope, $rootScope, $location, $state, $window,$filter, $bzPopup, $uibModal, bzResourceSvc, userSvc, authSvc, bzUpload) {
		var vmUserInfo = this;

		vmUserInfo.menuActive = "info";
		//Vars
		vmUserInfo.avatarDir = settingJs.configs.uploadDirectory.avatar;
		vmUserInfo.submitted = false;
		vmUserInfo.lockForm = false;
		vmUserInfo.optionTimePicker = {
			timePicker: false,
			locale: {
				format: 'DD/MM/YYYY'
			}
		};
		vmUserInfo.formData = {};
		vmUserInfo.formData = $window.data;
		vmUserInfo.formData.roles = $window.user.scope;
		vmUserInfo.listVocative = [{ name: 'Anh', value: 'Anh' },
		{ name: 'Chị', value: 'Chị' },
		{ name: 'Cô', value: 'Cô' },
		{ name: 'Chú', value: 'Chú' },
		{ name: 'Bác', value: 'Bác' },
		{ name: 'Ông', value: 'Ông' },
		{ name: 'Bà', value: 'Bà' }];
		vmUserInfo.urlAvatar = settings.services.webUrl + vmUserInfo.avatarDir + vmUserInfo.formData.avatar;
		// Methods
		vmUserInfo.checkInput = checkInput;
		vmUserInfo.editInfo = editInfo;
		vmUserInfo.popChangePass = popChangePass;
		vmUserInfo.uploadAvatar = uploadAvatar;
		//Init
		
		

		
		// console.log(123,vmUserInfo.formData.dob);
		angular.element('#hide1').removeClass('hidden');

		function checkInput() {
			vmUserInfo.err = null;
		}

		function uploadAvatar(isvalidFormInfo) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: '/assets/global/cropper/view.html',
				controller: function ($scope, $uibModalInstance) {
					var popupScope = this;
					$scope.popupScope = {
						image: vmUserInfo.avatarDir + vmUserInfo.formData.avatar,
						event: 'crop:image',
						ratio: 1,
						width: 500,
						height: 500,
						// mimeType : 'image/jpeg'
					};
					$scope.$on('crop:image', function (event, res) {
						bzUpload.uploadBase64({ directory: 'avatar_image', image: res.image }).then(function (resp) {
							vmUserInfo.formData.avatar = resp.name;
							modalInstance.close();
							editInfo(isvalidFormInfo, true);
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

		
		function editInfo(isValid, reload) {
			vmUserInfo.submitted = true;
			vmUserInfo.lockForm = true;
			if (isValid) {
				delete vmUserInfo.formData.deletedAt;
				delete vmUserInfo.formData.__v;
				delete vmUserInfo.formData.password_token;
				delete vmUserInfo.formData.created;
				delete vmUserInfo.formData.provider;
				delete vmUserInfo.formData.provider_id;
				delete vmUserInfo.formData.activeToken;
				delete vmUserInfo.formData.favorite_product;
				delete vmUserInfo.formData.password;
				
				if(vmUserInfo.formData.dob){
					var dates = vmUserInfo.formData.dob.toString().split("/");
					if(dates.length == 3) {
						vmUserInfo.formData.dob = new Date(dates[2], dates[1] - 1, dates[0]);
					} else {
						vmUserInfo.formData.dob = new Date(vmUserInfo.formData.dob);
					}
				}
				
				
				authSvc.update(vmUserInfo.formData, vmUserInfo.formData._id).then(function (resp) {

					if (reload) {
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Ảnh đại diện',
								message: "Cập nhập thành công"
							}
						});
						setTimeout(function () {
							window.location.reload();
						}, 1000)
					}
					else {
						vmUserInfo.formData.name = resp.name;
						vmUserInfo.formData.phone = resp.phone;
						vmUserInfo.formData.email = resp.email;
						vmUserInfo.formData.vocative = resp.vocative;
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Thông tin',
								message: "Cập nhập thành công"
							}
						});
					}
					vmUserInfo.lockForm = false;
				}).catch(function (err) {
					vmUserInfo.err = err.data.message;
					vmUserInfo.lockForm = false;
					if(vmUserInfo.err != 'email' && vmUserInfo.err != 'phone'){
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Lỗi',
								message: "Dữ liệu nhập vào bị lỗi !!"
							}
						});
					}
					console.log(err);
				});
			}
			else {
				vmUserInfo.submitted = true;
				vmUserInfo.lockForm = false;
			}


		}

		function popChangePass() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: settings.services.webUrl + '/modules/web-auth/view/client/popup/change-pass/view.html',
				controller: 'popChangePassCtrl',
				controllerAs: 'vmChangePass',
			});
		}


		//End func
	}
})();