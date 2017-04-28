var userEditCtrl = (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('userEditCtrl', userEditCtrl);

	function userEditCtrl($scope, $window, $state, $stateParams, $bzPopup, userRoles, authSvc, userSvc, bzResourceSvc, listClasses) {
		var userEdit = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin())) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		userEdit.formData = {};
		userEdit.queryParams = $stateParams;
		userEdit.userRoles = [];
		userEdit.loading = true;
		userEdit.listClasses = listClasses;
		// Methods
		userEdit.isEdit = isEdit;
		userEdit.save = save;
		userEdit.initFormData = initFormData;
		userEdit.getData = getData;
		userEdit.listVocative = [{ name: 'Anh', value: 'Anh' },
		{ name: 'Chị', value: 'Chị' },
		{ name: 'Cô', value: 'Cô' },
		{ name: 'Chú', value: 'Chú' },
		{ name: 'Bác', value: 'Bác' },
		{ name: 'Ông', value: 'Ông' },
		{ name: 'Bà', value: 'Bà' }];


		// Init
		isEdit();
		getRolesUser();

		function isEdit() {
			userEdit.isEditMode = userEdit.queryParams.id !== undefined;
		}

		function getRolesUser() {
			userSvc.getRoles().then(function (resp) {
				if (resp.success) {
					userEdit.userRoles = resp.data;
				}
			})
		}

		function initFormData(data) {
			// console.log(data);
			userEdit.lockForm = false;
			userEdit.submitted = false;
			var aaa = userEdit.isEditMode ? data.name : '';
			/*init user chung*/
			userEdit.tmppassword = ""
			userEdit.formData = {
				name: (userEdit.isEditMode == true) ? data.name : '',
				phone: userEdit.isEditMode ? data.phone : '',
				email: userEdit.isEditMode ? data.email : '',
				password: userEdit.isEditMode ? data.password : '',
				// cfpassword: '',
				roles: userEdit.isEditMode ? data.roles : ['user'],
				vocative: userEdit.isEditMode ? data.vocative : 'Anh',
				dob: userEdit.isEditMode ? data.dob : '',
				status: userEdit.isEditMode ? data.status : true,
			};
			userEdit.loading = false;
		}

		function getData() {
			if (userEdit.isEditMode) {
				bzResourceSvc.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
					.get({ id: userEdit.queryParams.id }, function (resp) {
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

		function save(isValid) {

			userEdit.submitted = true;
			if (!userEdit.formData.dob) userEdit.formData.dob = '';
			if (!userEdit.lockForm && isValid) {
				userEdit.lockForm = true;

				/*Format Status Đúng định dạng true false*/
				if (userEdit.formData.status == 1)
					userEdit.formData.status = true;
				else if (userEdit.formData.status == 0)
					userEdit.formData.status = false;

				/*Thêm User*/
				if (!userEdit.isEditMode) {
					userEdit.formData.cfpassword = userEdit.formData.password;
					userSvc.create(userEdit.formData).then(function (resp) {
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Thành viên',
								message: resp.message
							}
						});

						$state.go('users', { id: null });
					}, function (err) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Thành viên',
								message: err.data.message
							}
						});
						userEdit.lockForm = false;
					});
				}

				/*Sửa User*/
				else if (userEdit.isEditMode) {
					/*Format Status Đúng định dạng true false*/
					if (userEdit.formData.status == 1)
						userEdit.formData.status = true;
					else if (userEdit.formData.status == 0)
						userEdit.formData.status = false;

					/*Xét password mới cho user*/
					// userEdit.formData.cfpassword = userEdit.formData.password
					delete userEdit.formData.password;
					delete userEdit.formData.cfpassword;

					userSvc.update(userEdit.formData, userEdit.queryParams.id).then(function (resp) {
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Thành viên',
								message: "Sửa thành công"
							}
						});

						$state.go('users', { id: null });
					}, function (err) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Thành viên',
								message: err.data.message
							}
						});
						userEdit.lockForm = false;
					});
				}
			}
		}
	}

	var resolve = {
		/* @ngInject */
		preload: function (bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve: resolve
	};
})();