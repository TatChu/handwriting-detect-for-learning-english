;(function(){
	'use strict';

	angular
	.module('bzAuth')
	.controller('authCtrl', authCtrl);

	function authCtrl($rootScope, $scope, $state, $window, $bzPopup, authSvc){
		var auth = this;

		// Methods
		auth.siteLogin = siteLogin;
		auth.loginFacebook = loginFacebook;

		// Init
		initFormData();

		function initFormData(){
			auth.lockForm = false;
			auth.submitted = false;
			auth.formData = {
				phone: '',
				password: ''
			};
		}

		function siteLogin(isValid){
			auth.submitted = true;

			if(!auth.lockForm && isValid){
				auth.lockForm = true;
				$scope.pageMethods.authSvc.siteLogin(auth.formData, function(resp){
					$window.location.href = settingJs.configs.adminUrl;
					auth.lockForm = false;
				}, function(err){
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: 'Login',
							message: err.data.message
						}
					});

					auth.lockForm = false;
				});
			}
		}

		function loginFacebook(){
			authSvc.getFacebook().then(function(user){
				if(!user.error){
					social('facebook', user);
					auth.lockForm = true;
					$scope.pageMethods.authSvc.facebookLogin(user, function(resp){
						$window.location.href = '/';
						auth.lockForm = false;
					}, function(err){
						$bzPopup.toastr({
							type: 'error',
							data:{
								title: 'Login',
								message: err.data.message
							}
						});
						auth.lockForm = false;
					});
				}else{
					$bzPopup.toastr({
						type: 'error',
						data:{
							title: 'Login',
							message: '' + user.error
						}
					});
					auth.lockForm = false;
				}
			});
		}

		function social(type, user){
			$scope.social = {
				type: type,
				id: user.id,
				name: user.name,
				email: user.email,
				profile_picture:user.picture+'?sz=200'
			};
			if(type == 'facebook'){
				$scope.social.profile_picture = 'https://graph.facebook.com/v2.5/'+user.id+'/picture?width=200&height=200';
			}
			/*Thao tác tại đây*/
		}
	}
})();