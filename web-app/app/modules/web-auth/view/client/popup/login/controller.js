;(function(){
	'use strict';

	angular
	.module('bzAuth')
	.controller('popLoginCtrl', popLoginCtrl);

	function popLoginCtrl($scope, $rootScope, $state,$window, $bzPopup ,$uibModal, $uibModalInstance, authSvc , bzUtilsSvc){
		var vmLogin = this;
		//Vars
		vmLogin.formData = {};
		vmLogin.submitted = false;
		vmLogin.lockForm = false;
		// Methods
		vmLogin.login = login;
		vmLogin.loginFacebook = loginFacebook;
		vmLogin.popForgotPass = popForgotPass;
		vmLogin.popRegister = popRegister;
		vmLogin.checkInput = checkInput;
		vmLogin.getInfoLocalStorage = getInfoLocalStorage;


		//Init
		// angular.element('.modal-dialog').addClass('aaa');
		getInfoLocalStorage();

		function getInfoLocalStorage() {
            let dataStorage = bzUtilsSvc.getInfoUser();
            if (dataStorage) {
                vmLogin.formData.phone = dataStorage.phone || '';
            }
        }

		function login(isValid) {
			vmLogin.submitted = true;
			vmLogin.lockForm = true;
			if(isValid) {
				authSvc.siteLogin(vmLogin.formData, function(resp){
					bzUtilsSvc.removeInfoUser();
					$uibModalInstance.close();
					// $window.location.href = "/";
				}, function(err){
					vmLogin.err = err.data.message;
					vmLogin.lockForm = false;
				});
			}
			else {
				vmLogin.submitted = true;
				vmLogin.lockForm = false;
			}
		}

		function loginFacebook(){
			authSvc.getFacebook().then(function(user){
				if(!user.error){
					social('facebook', user);
					vmLogin.lockForm = true;

					authSvc.facebookLogin(user, function(resp){
						$uibModalInstance.close();
						vmLogin.lockForm = false;
					}, function(err){
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Đăng nhập facebook',
								message: err.data.message
							}
						});
						vmLogin.lockForm = false;
					});
				} else {
					if(user.error.code == 190){
						vmLogin.loginFacebook();
					}
					else{
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Đăng nhập facebook',
								message: '' + user.error
							}
						});
					}
						
					vmLogin.lockForm = false;
				}
			});
		}

		function social(type, user){
			vmLogin.social = {
				type: type,
				id: user.id,
				name: user.name,
				email: user.email,
				profile_picture:user.picture+'?sz=200',
			};
			if(type == 'facebook'){
				vmLogin.social.profile_picture = 'https://graph.facebook.com/v2.5/'+user.id+'/picture?width=200&height=200';
			}
			/*Thao tác tại đây*/
		}

		function popForgotPass() {
			var data = {
				showPopup : true
			}
			$uibModalInstance.close(data);
			authSvc.popForgotPass();
		}
		function popRegister() {
			var data = {
				showPopup : true
			}
			$uibModalInstance.close(data);
			authSvc.popRegister();
		}

		function checkInput() {
			vmLogin.err = null;
		}

	//End func
	}
})();