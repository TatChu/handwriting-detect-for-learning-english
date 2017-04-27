;(function(){
	'use strict';

	angular
	.module('bzAuth')
	.controller('popRegisterCtrl', popRegisterCtrl);

	function popRegisterCtrl($scope, $rootScope, $state, $window, $bzPopup , $uibModal, authSvc, $uibModalInstance,bzUtilsSvc){
		var vmRegister = this
		//Vars
		vmRegister.formData = {};
		vmRegister.submitted = false;
		vmRegister.lockForm = false;
		// Methods
		vmRegister.register = register;
		vmRegister.login = login;
		vmRegister.popLogin = popLogin;
		vmRegister.loginFacebook = loginFacebook;
		vmRegister.checkInput = checkInput;
		vmRegister.checkPhoneMatch = checkPhoneMatch;
		vmRegister.getInfoLocalStorage = getInfoLocalStorage;

		//Init
		getInfoLocalStorage();

		function getInfoLocalStorage() {
			let dataStorage = bzUtilsSvc.getInfoUser();
			if (dataStorage) {
				vmRegister.formData.name = dataStorage.name || '';
				vmRegister.formData.phone = dataStorage.phone || '';
				vmRegister.formData.cfphone = dataStorage.phone || '';
			}
		}

		function register(isValid) {
			vmRegister.submitted = true;
			vmRegister.lockForm = true;
			if(isValid) {
				vmRegister.formData.cfpassword = vmRegister.formData.password;
				authSvc.register(vmRegister.formData).then(function(resp){
					fbq('track', 'CompleteRegistration');
					bzUtilsSvc.removeInfoUser();
					$bzPopup.toastr({
						type: 'success',
						data:{
							title: 'Thành công',
							message: "Đăng ký thành công"
						}
					});
					$uibModalInstance.close();
					//Đăng nhập thành công thì login
					login(resp);
				}).catch(function(err){
					vmRegister.err = err.data.message;
					vmRegister.lockForm = false;
					if(vmRegister.err != 'email' && vmRegister.err != 'phone'){
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Lỗi',
								message: "Dữ liệu nhập vào bị lỗi !!"
							}
						});
					}
				});
			}
			else {
				vmRegister.submitted = true;
				vmRegister.lockForm = false;
			}
		}
		function checkInput() {
			vmRegister.err = null;
		}

		function checkPhoneMatch(isValid) {
			if(vmRegister.formData.cfphone != vmRegister.formData.phone){
				isValid = false;
				return true;
			}
			return false;
		}
		function login(user) {
			console.log(user);
			var data = {
				phone : user.phone,
				password: "123",
				isRegister: true
			}
			authSvc.siteLogin(data, function(resp){
				
				$window.location.href = "/";
			});
		}
		function loginFacebook(){
			authSvc.getFacebook().then(function(user){
				user.isRegister = true;
				if(!user.error){
					social('facebook', user);
					authSvc.facebookLogin(user, function(resp){
						fbq('track', 'CompleteRegistration');
						bzUtilsSvc.removeInfoUser();
						$window.location.href = '/';
					}, function(err){
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Đăng ký facebook',
								message: err.data.message
							}
						});
					});
				}else{
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: 'Đăng ký facebook',
							message: '' + user.error
						}
					});
				}
			});
		}

		function social(type, user){
			
			vmRegister.social = {
				type: type,
				id: user.id,
				name: user.name,
				email: user.email,
				profile_picture:user.picture+'?sz=200'
				
			};
			if(type == 'facebook'){
				vmRegister.social.profile_picture = 'https://graph.facebook.com/v2.5/'+user.id+'/picture?width=200&height=200';
			}
			/*Thao tác tại đây*/
		}
		
		function popLogin() {
			$uibModalInstance.close();
			authSvc.popLogin();
		}


	//End func
}
})();