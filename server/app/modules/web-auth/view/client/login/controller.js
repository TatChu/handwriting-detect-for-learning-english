; (function () {
	'use strict';

	angular
		.module('bzAuth')
		.controller('authCtrl', authCtrl);

	function authCtrl($scope, $state, $window, $bzPopup, bzResourceSvc, authSvc ,$uibModal) {
		var vmAuth = this;

		//Vars
		vmAuth.user = {};
		// vmAuth.imagesDirectory = settingJs.configs.uploadDirectory.avatar || '/files/avatar_image/' ;
		// Methods
		// vmAuth.siteLogin = siteLogin;
		vmAuth.showPopupLogin = showPopupLogin;
		vmAuth.getInfo = getInfo;
		vmAuth.showPopupRegister = showPopupRegister;
		vmAuth.popForgotPass = popForgotPass;
		vmAuth.logout = logout;

		// Init
		getInfo();
		
		initFormData();
		angular.element('#sign-in-out-mb').removeClass('hidden');
		angular.element('#sign-in-out-desk').removeClass('hidden');
		angular.element('.avatar').removeClass('hidden');

		function initFormData() {
			vmAuth.lockForm = false;
			vmAuth.submitted = false;
			vmAuth.formData = {
				email: '',
				password: ''
			};
		}
		// function siteLogin(isValid) {
		// 	vmAuth.submitted = true;

		// 	if (!vmAuth.lockForm && isValid) {
		// 		vmAuth.lockForm = true;

		// 		$scope.pageMethods.authSvc.siteLogin(vmAuth.formData, function (resp) {
		// 			$window.location.href = '/admin';
		// 			vmAuth.lockForm = false;
		// 		}, function (err) {
		// 			$bzPopup.toastr({
		// 				type: 'error',
		// 				data: {
		// 					title: 'Login',
		// 					message: err.data.message
		// 				}
		// 			});

		// 			vmAuth.lockForm = false;
		// 		});
		// 	}
		// }
		
		function getInfo() {
			if($window.user.uid) {
				var id = $window.user.uid;
				bzResourceSvc.api($window.settings.services.apiUrl + '/user/profile/:id', { id: '@id' })
					.get({ id: 'id' }, function (resp) {
						vmAuth.user = resp;
						var name  = vmAuth.user.name;
						var listname = name.split(" ");
						vmAuth.name = listname[listname.length -1];
						vmAuth.urlAvatar = settings.services.webUrl + settingJs.configs.uploadDirectory.avatar + resp.avatar;
					});
			}

		}

		function showPopupLogin() {
			// var url = settings.services.webUrl + '/khach-hang/thong-tin-tai-khoan';
			authSvc.popLogin();
		}

		function showPopupRegister() {
			authSvc.popRegister();
		}

		function popForgotPass() {
			authSvc.popForgotPass();
		}

		function logout() {
			authSvc.siteLogout(function (resp) {
			});
		}

	}
})();
