var promotionAddCtrl = (function () {
	'use strict';

	angular
		.module('bzPromotion')
		.controller('promotionAddCtrl', promotionAddCtrl);

	function promotionAddCtrl($scope, $state, $stateParams, $bzPopup, $window, $timeout, authSvc, promotionSvc) {
		var vmPoA = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('promotion', 'add')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmPoA.loading = true;
		vmPoA.queryParams = $stateParams;

		// Methods
		vmPoA.addPromotion = addPromotion;
		vmPoA.removeDisabled = removeDisabled;

		// Init
		getData();

		/*FUNCTION*/
		// Start: Create default data
		function getData() {
			promotionSvc.add().then(function (resp) {
				vmPoA.prom = {
					type: 'PC',
					status: true
				};
				vmPoA.loading = false;
				vmPoA.listProm = resp.list;
				vmPoA.listProduct = resp.products;
			}).catch(function (error) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Có vấn đề! Hãy thử tải lại trang.'
					}
				});
			});
		}
		// End: Create default data

		// Submit add promotion
		function addPromotion(form) {
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
			vmPoA.promExist = vmPoA.listProm.find(function (item) {
				return item.name == vmPoA.prom.name;
			});
			if (vmPoA.promExist) {
				return;
			}
			promotionSvc.create({
				data: vmPoA.prom,
				product_apply: vmPoA.product_apply
			}).then(function (resp) {
				$state.go('promotion-list');
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Thêm giảm giá sản phẩm thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Thêm giảm giá sản phẩm thất bại!'
					}
				});
			});
		}

		function removeDisabled(form) {
			form.$submitted = false;
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