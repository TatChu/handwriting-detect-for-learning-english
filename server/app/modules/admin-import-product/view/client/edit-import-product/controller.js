var importProductEditCtrl = (function () {
	'use strict';

	angular
		.module('bzImportProduct')
		.controller('importProductEditCtrl', importProductEditCtrl);

	function importProductEditCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, NgTableParams, ngTableEventsChannel, authSvc, importProductSvc) {
		var vmIPrE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('import_product', 'add')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmIPrE.queryParams = $stateParams;

		// Methods
		vmIPrE.editPrice = editPrice;
		vmIPrE.getDetailProduct = getDetailProduct;
		vmIPrE.calcuteLost = calcuteLost;
		vmIPrE.calcuteTotalMoney = calcuteTotalMoney;
		vmIPrE.submitForm = submitForm;
		vmIPrE.enableForm = enableForm;

		// Init
		getData();

		/*FUNCTION*/
		function getData() {
			importProductSvc.edit(vmIPrE.queryParams.id).then(function (resp) {
				// console.log(resp);
				vmIPrE.productList = resp.productList;
				vmIPrE.supplierList = resp.supplierList;
				vmIPrE.importProduct = resp.data;
				vmIPrE.productDetail = resp.data.product;
				vmIPrE.minQty = vmIPrE.productDetail.qty_in_stock < vmIPrE.importProduct.qty_before ? vmIPrE.importProduct.qty_before - vmIPrE.productDetail.qty_in_stock : 0;
				vmIPrE.tmpQty = {};
				calcuteLost();
			}).catch(function (error) {
				console.log(error);
			});
		}

		function editPrice(priceProduct) {
			vmIPrE.showEditPrice = !vmIPrE.showEditPrice;
		}

		function getDetailProduct() {
			var id = vmIPrE.importProduct.id_product;
			vmIPrE.productList.forEach(function (value, key) {
				if (value._id === id) {
					vmIPrE.productDetail = value;
					vmIPrE.importProduct.price_new = value.price;
					vmIPrE.showEditPrice = false;
					return;
				}
			});
		}

		function calcuteLost() {
			var before = vmIPrE.importProduct.qty_before;
			var after = vmIPrE.importProduct.qty_after;
			if (!isNaN(before) && !isNaN(after)) {
				vmIPrE.tmpQty.qty_number_after = Math.round((before - after) * 100) / 100;
				vmIPrE.tmpQty.qty_percent_after = (vmIPrE.tmpQty.qty_number_after / before * 100).toFixed(2);
			}
		}

		function calcuteTotalMoney(number) {
			vmIPrE.importProduct.total_money_after = number * vmIPrE.importProduct.price_new;
		}

		function enableForm(form) {
			if (form) {
				form.$submitted = false;
			}
		}

		function submitForm(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: "Vui lòng điền đầy đủ thông tin."
					}
				});
				return;
			}
			vmIPrE.importProduct.price_old = vmIPrE.productDetail.price;

			importProductSvc.update({
				data: vmIPrE.importProduct,
				product: vmIPrE.productDetail
			}, vmIPrE.queryParams.id).then(function (resp) {
				form.$submitted = false;
				console.log(resp);
				$state.go('import-product');
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Import product thành công!'
					}
				});
			}).catch(function (error) {
				console.log(error);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Import product thất bại!!'
					}
				});
			});
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