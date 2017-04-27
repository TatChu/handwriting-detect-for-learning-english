;(function(){
	'use strict';

	angular
	.module('bzAuth')
	.controller('popForgotPassCtrl', popForgotPassCtrl);

	function popForgotPassCtrl($scope, $rootScope, $state,$window, $bzPopup, $uibModalInstance, authSvc ){
		var vmForgotPass = this;
		//Vars
		vmForgotPass.formData = {};
		vmForgotPass.submitted = false;
		vmForgotPass.lockForm = false;

		// Methods
		vmForgotPass.forgotPass = forgotPass;
		vmForgotPass.checkInput = checkInput;
		//Init


		function checkInput() {
			vmForgotPass.err = null;
		}

		function forgotPass(isValid) {
			vmForgotPass.submitted = true;
			vmForgotPass.lockForm = true;
			if(isValid){
				authSvc.forgotPassword(vmForgotPass.formData).then(function(resp){
					$bzPopup.toastr({
						type: 'success',
						data:{
							title: "Thành công",
							message: "Gửi mail thành công"
						}
					});
					$uibModalInstance.close();
				}).catch(function(err){
					vmForgotPass.err = err.data.message;
					// $bzPopup.toastr({
					// 	type: 'error',
					// 	data:{
					// 		title: "Lỗi",
					// 		message: err.data.message
					// 	}
					// });
					vmForgotPass.lockForm = false;
				})
			}
			else{
				vmForgotPass.submitted = true;
				vmForgotPass.lockForm = false;
			}
		}


	//End func
}
})();