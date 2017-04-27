var searchAddCtrl = (function () {
	'use strict';

	angular
		.module('bzSearch')
		.controller('searchAddCtrl', searchAddCtrl);

	function searchAddCtrl($scope, $state, $stateParams, $bzPopup, $window, authSvc, searchSvc) {
		var vmSeA = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('search','add') ))){
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmSeA.loading = true;
		vmSeA.queryParams = $stateParams;

		// Methods
		vmSeA.removeDisabledSubmit = removeDisabledSubmit;
		vmSeA.add = add;
		vmSeA.getData = getData;

		// Init

		/*FUNCTION*/

		// Submit add product

		function getData() {
			vmSeA.search = {
				status: true
			}
		}

		function add(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin!'
					}
				});
				return;
			};
			searchSvc.create({
				data: vmSeA.search
			}).then(function (resp) {
				$state.go("search-list");
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Thêm từ khóa thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Thêm từ khóa thất bại!'
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