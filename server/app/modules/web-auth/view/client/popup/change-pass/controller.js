;(function(){
	'use strict';

	angular
	.module('bzAuth')
	.controller('popChangePassCtrl', popChangePassCtrl);

	function popChangePassCtrl($scope, $rootScope, $state,$window, $bzPopup, $uibModalInstance, authSvc ){

		//Vars
		$scope.formData = {};
		$scope.submitted = false;
		$scope.lockForm = false;

		// Methods
		$scope.changePass = changePass;

		//Init

		function changePass(isValid) {
			console.log(123);
			$scope.submitted = true;
			$scope.lockForm = true;
			if(isValid){
				authSvc.postChangePass($scope.formData).then(function(resp){
					$bzPopup.toastr({
						type: 'success',
						data:{
							title: "Thành công",
							message: "Đổi mật khẩu thành công"
						}
					});
					$uibModalInstance.close();
					authSvc.siteLogout();
				}).catch(function(err){
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: "Lỗi",
							message: err.data.message
						}
					});
					$scope.lockForm = false;
				});
			}
			else{
				$scope.submitted = true;
				$scope.lockForm = false;
			}
		}


	//End func
}
})();