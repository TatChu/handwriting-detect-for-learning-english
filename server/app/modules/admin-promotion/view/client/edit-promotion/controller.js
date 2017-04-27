var promotionEditCtrl = (function () {
	'use strict';

	angular
		.module('bzPromotion')
		.controller('promotionEditCtrl', promotionEditCtrl);

	function promotionEditCtrl($scope, $state, $stateParams, $bzPopup, $window, $timeout, authSvc, promotionSvc) {
		var vmPoE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('promotion', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmPoE.loading = true;
		vmPoE.queryParams = $stateParams;

		// Methods
		vmPoE.submit = submit;
		vmPoE.removeDisabled = removeDisabled;

		// Init
		getData();

		/*FUNCTION*/
		// Start: Create default data
		function getData() {
			promotionSvc.edit(vmPoE.queryParams.id).then(function (resp) {
				vmPoE.prom = resp.prom;
				vmPoE.listProm = resp.listProm;
				vmPoE.listProduct = resp.products;
				vmPoE.product_apply = vmPoE.prom.product.map(function(item){
					return item._id;
				});
				vmPoE.loading = false;
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

		// Submit promotion
		function submit(form) {
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
			vmPoE.promExist = vmPoE.listProm.find(function (item) {
				return item.name == vmPoE.prom.name;
			});
			if (vmPoE.promExist) {
				return;
			}
			promotionSvc.update({
				data: vmPoE.prom,
				product_apply: vmPoE.product_apply
			}, vmPoE.queryParams.id).then(function (resp) {
				$state.go('promotion-list');
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Sửa giảm giá sản phẩm thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Sửa giảm giá sản phẩm thất bại!'
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