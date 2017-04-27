var userEditProfileCtrl = (function(){
	'use strict';

	angular
	.module('bzUser')
	.controller('userEditProfileCtrl', userEditProfileCtrl);

	function userEditProfileCtrl($scope, $window, $state, $stateParams, $bzPopup, userRoles, authSvc, userSvc, bzResourceSvc, salemanScopes){
		var mvUEP = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if( !(authSvc.isSuperAdmin() || authSvc.isSaleManager()) ){
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/


		// Vars
		mvUEP.queryParams = $stateParams;
		mvUEP.userRoles = userRoles;
		mvUEP.salemanScopes = salemanScopes;
		mvUEP.isEditMode = mvUEP.queryParams.id !== undefined;

		// Methods
		mvUEP.save = save;

		// Init
		getData();

		function initFormData(data){
			mvUEP.lockForm = false;
			mvUEP.submitted = false;

			/*init user chung*/
			mvUEP.formData = {
				name: mvUEP.isEditMode ? data.name : '',
				email: mvUEP.isEditMode ? data.email : '',
				password: '',
				cfpassword: '',
				roles: mvUEP.isEditMode ? data.roles : ['user'],
				status: mvUEP.isEditMode ? data.status : false,
				saleman: {
					active: mvUEP.isEditMode ? data.saleman.active : false,
					manager: mvUEP.isEditMode ? data.saleman.manager : false,
					types: mvUEP.isEditMode ? data.saleman.types : [],
				}
			};
			/*init user module sale*/
			if(mvUEP.queryParams.module == 'sale'){
				mvUEP.formData.roles = ['admin', 'user', 'sale'];
				mvUEP.formData.status = mvUEP.isEditMode ? data.status : true;
			}
			/*end init user module sale*/
		}

		function getData(){
			if(mvUEP.isEditMode){
				bzResourceSvc.api($window.settings.services.apiUrl + '/user/:id', {id: '@id'})
				.get({id: mvUEP.queryParams.id}, function(resp){
					delete resp.__v;
					delete resp.password_token;
					delete resp.created;
					delete resp.provider;
					delete resp.activeToken;

					initFormData(resp);
				});
			} else {
				initFormData();
			}
		}

	// 	function save(isValid){
	// 		mvUEP.submitted = true;

	// 		if(!mvUEP.lockForm && isValid){
	// 			mvUEP.lockForm = true;

	// 			/*Format Status Đúng định dạng true false*/
	// 			if(mvUEP.formData.status == 1)
	// 				mvUEP.formData.status = true;
	// 			else if(mvUEP.formData.status == 0)
	// 				mvUEP.formData.status = false;

	// 			/*Thêm User*/
	// 			if(!mvUEP.isEditMode){
					
	// 				// delete mvUEP.formData.saleman;
	// 				mvUEP.formData.cfpassword = mvUEP.formData.password;
	// 				// console.log('testxx', mvUEP.formData);
	// 				// return;
	// 				userSvc.create(mvUEP.formData).then(function(resp){
	// 					$bzPopup.toastr({
	// 						type: 'success',
	// 						data:{
	// 							title: 'Thành viên',
	// 							message: resp.message
	// 						}
	// 					});

	// 					$state.go('user-sale', {id: null});
	// 				},function(err){
	// 					$bzPopup.toastr({
	// 						type: 'error',
	// 						data:{
	// 							title: 'Thành viên',
	// 							message: err.data.message
	// 						}
	// 					});
	// 					mvUEP.lockForm = false;
	// 				});
	// 			}

	// 			/*Sửa User*/
	// 			else if(mvUEP.isEditMode) {

	// 				/*Format Status Đúng định dạng true false*/
	// 				if(mvUEP.formData.status == 1)
	// 					mvUEP.formData.status = true;
	// 				else if(mvUEP.formData.status == 0)
	// 					mvUEP.formData.status = false;

	// 				/*Xét password mới cho user*/
	// 				mvUEP.formData.password = mvUEP.tmppassword;
	// 				mvUEP.formData.cfpassword = mvUEP.tmppassword;

	// 				// mvUEP.formData.cfpassword = mvUEP.tmpcfpassword;
	// 				console.log('test', mvUEP.formData);

	// 				userSvc.update(mvUEP.formData, mvUEP.queryParams.id).then(function(resp){
	// 					$bzPopup.toastr({
	// 						type: 'success',
	// 						data:{
	// 							title: 'Thành viên',
	// 							message: resp.message
	// 						}
	// 					});

	// 					$state.go('user-sale', {id: null});
	// 				},function(err){
	// 					$bzPopup.toastr({
	// 						type: 'error',
	// 						data:{
	// 							title: 'Thành viên',
	// 							message: err.data.message
	// 						}
	// 					});
	// 					mvUEP.lockForm = false;
	// 				});
	// 			}
	// 		}
	// 	}
	}

	var resolve = {
		/* @ngInject */
		preload: function(bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve : resolve
	};
})();