var importProductCtrl = (function () {
	'use strict';

	angular
		.module('bzImportProduct')
		.controller('importProductCtrl', importProductCtrl);

	function importProductCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, NgTableParams, ngTableEventsChannel, authSvc, importProductSvc) {
		var vmIPr = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('import_product', 'add')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmIPr.queryParams = $stateParams;

		// Methods
		vmIPr.editPrice = editPrice;
		vmIPr.getDetailProduct = getDetailProduct;
		vmIPr.calcuteLost = calcuteLost;
		vmIPr.calcuteTotalMoney = calcuteTotalMoney;
		vmIPr.submitForm = submitForm;
		vmIPr.enableForm = enableForm;

		// Init
		getData();


		/*FUNCTION*/
		function getData() {
			importProductSvc.getDataImport().then(function (resp) {
				vmIPr.productList = resp.productList;
				vmIPr.supplierList = resp.supplierList;
				vmIPr.importProduct = {
					id_supplier: vmIPr.supplierList[0]._id
				};
				vmIPr.productDetail = {};
				vmIPr.tmpQty = {};
			}).catch(function (error) {
				console.log(error);
			});
		}

		function editPrice(priceProduct) {
			vmIPr.showEditPrice = !vmIPr.showEditPrice;
		}

		function getDetailProduct() {
			var id = vmIPr.importProduct.id_product;
			vmIPr.productList.forEach(function (value, key) {
				if (value._id === id) {
					vmIPr.productDetail = value;
					vmIPr.importProduct.price_new = value.price;
					vmIPr.showEditPrice = false;
					return;
				}
			});
		}

		function calcuteLost() {
			var before = vmIPr.importProduct.qty_before;
			var after = vmIPr.importProduct.qty_after;
			if (!isNaN(before) && !isNaN(after)) {
				vmIPr.tmpQty.qty_number_after = Math.round((before - after) * 100) / 100;
				vmIPr.tmpQty.qty_percent_after = (vmIPr.tmpQty.qty_number_after / before * 100).toFixed(2);
			}
		}

		function calcuteTotalMoney(number) {
			vmIPr.importProduct.total_money_after = number * vmIPr.importProduct.price_new;
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
			vmIPr.importProduct.price_old = vmIPr.productDetail.price;

			importProductSvc.importProduct({
				data: vmIPr.importProduct,
				product: vmIPr.productDetail
			}).then(function (resp) {
				form.$submitted = false;
				$state.go("import-product");
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