;(function(){
	'use strict';

	angular
	.module('bzUser')
	.controller('popChangePassCtrl', popChangePassCtrl);

	function popChangePassCtrl($scope, $rootScope, $state, $bzPopup, $uibModalInstance, 
		authSvc){
		var mvCPass = this;

		// Vars
		mvCPass.queryParams = {};
		mvCPass.userCurent = authSvc.getProfile();
		
		// Methods
		mvCPass.submit = submit;

		// Init
		initFormData();

		function initFormData(){
			mvCPass.submitted = false;
			mvCPass.lockForm = false;

			mvCPass.formData = {
				currentPassword: '',
				newPassword:'',
				confirmNewPassword:'',
			};
		}

		function submit(isValid){
			mvCPass.submitted = true;

			if(!mvCPass.lockForm && isValid){
				mvCPass.lockForm = true;
				authSvc.postChangePass(mvCPass.formData).then(function(resp){
					$bzPopup.toastr({
						type: 'success',
						data:{
							title: "Thành công",
							message: "Đổi mật khẩu thành công"
						}
					});
					$state.reload();
					$uibModalInstance.close();
					mvCPass.lockForm = false;
					authSvc.siteLogout()
				}).catch(function(err){
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: "Lỗi",
							message: err.data.message
						}
					});
					$state.reload();
					$uibModalInstance.close();
					mvCPass.lockForm = false;
				});
			}
		}
	}
})();