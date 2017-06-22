; (function () {
	'use strict';

	angular
		.module('bzAuth')
		.controller('resetPassCtrl', resetPassCtrl);

	function resetPassCtrl($scope, $rootScope, $state,$window, $bzPopup,  authSvc) {
		var vmResetPass = this;

		//Vars
		vmResetPass.formData = {};
		vmResetPass.submitted = false;
		vmResetPass.lockForm = false;
		vmResetPass.formData.token = $window.data.resetPasswordToken;
		// Methods
		vmResetPass.resetPass = resetPass;

		//Init
		angular.element('#hide1').removeClass('hidden');
	
		function resetPass(isValid) {
			vmResetPass.submitted = true;
			vmResetPass.lockForm = true;
			if(isValid){
				authSvc.resetPassword(vmResetPass.formData).then(function(resp){
					$bzPopup.toastr({
						type: 'success',
						data:{
							title: "Thành công",
							message: "Đổi mật khẩu thành công"
						}
					});
					$window.location.href = '/';
				}).catch(function(err){
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: "Lỗi",
							message: err.data.message
						}
					});
					vmResetPass.lockForm = false;
				});
			}
			else{
				vmResetPass.submitted = true;
				vmResetPass.lockForm = false;
			}
		}
		

		//End func
	}
})();