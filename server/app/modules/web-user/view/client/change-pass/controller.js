; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('changePassCtrl', changePassCtrl);

	function changePassCtrl($scope, $rootScope, $state, $window, $bzPopup, authSvc) {
		var vmChangePass = this;

		//Vars
		vmChangePass.formData = {};
		vmChangePass.submitted = false;
		vmChangePass.lockForm = false;
		// Methods
		vmChangePass.changePass = changePass;
		//Init
		// angular.element('#vmChangePass-hide1').removeClass('hidden');

		function changePass(isValid) {

			vmChangePass.submitted = true;
			vmChangePass.lockForm = true;

			if (isValid) {
				authSvc.postChangePass(vmChangePass.formData).then(function (resp) {
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: "Thành công",
							message: "Đổi mật khẩu thành công"
						}
					});
					authSvc.siteLogout();
					$window.location.href = '/';
				}).catch(function (err) {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: "Lỗi",
							message: err.data.message
						}
					});
					vmChangePass.lockForm = false;
				});
			}
			else {
				vmChangePass.submitted = true;
				vmChangePass.lockForm = false;
			}
		}


		//End func
	}
})();