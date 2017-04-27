var searchEditCtrl = (function () {
	'use strict';

	angular
		.module('bzSearch')
		.controller('searchEditCtrl', searchEditCtrl);

	function searchEditCtrl($scope, $state, $stateParams, $bzPopup, $window, authSvc, searchSvc) {
		var vmSeE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('search', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmSeE.queryParams = $stateParams;

		// Methods
		vmSeE.removeDisabledSubmit = removeDisabledSubmit;
		vmSeE.update = update;
		vmSeE.getData = getData;

		// Init

		/*FUNCTION*/

		// Submit add product

		function getData() {
			searchSvc.edit(vmSeE.queryParams.id).then(function (resp) {
				vmSeE.search = resp.data;
				vmSeE.loading = true;
			});
		}

		function update(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin'
					}
				});
				return;
			};
			searchSvc.update({
				data: vmSeE.search
			}, vmSeE.queryParams.id).then(function (resp) {
				$state.go("search-list");
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Sửa từ khóa thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Sửa từ khóa thất bại!'
					}
				});
			});
		}

		function removeDisabledSubmit(form) {
			if (form) form.$submitted = false;
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