var reportProductADayCtrl = (function () {
	'use strict';

	angular
		.module('bzReport')
		.controller('reportProductADayCtrl', reportProductADayCtrl);

	function reportProductADayCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, reportSvc, productSvc, statusProduct) {
		var vmRPA = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', 'view')))) {
			$state.go('error403');
		}

		vmRPA.showBtnAdd = authSvc.hasPermission('order', 'add');
		vmRPA.showBtnEdit = authSvc.hasPermission('order', ['add', 'edit']);
		vmRPA.showBtnDelete = authSvc.hasPermission('order', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmRPA.loading = true;
		vmRPA.queryParams = $stateParams;
		vmRPA.setting = settingJs;
		vmRPA.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmRPA.statusProduct = statusProduct;

		// Methods
		vmRPA.filterForm = filterForm;
		vmRPA.clearFilter = clearFilter;
		vmRPA.checkImgOld = productSvc.checkImgOld;
		vmRPA.formatTag = formatTag;
		vmRPA.formatCategory = formatCategory;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmRPA.table);

		/*FUNCTION*/
		function getData() {
			reportSvc.reportProductADay(vmRPA.queryParams).then(function (resp) {
				vmRPA.queryParams.pageCount = resp.totalPage;
				vmRPA.totalItems = resp.totalItems;
				vmRPA.list = resp.items;
				vmRPA.categoryList = resp.categoryList;
				vmRPA.optionsCate = formatCategory(resp.categoryWithSub);
				vmRPA.tagList = resp.tagList;
				vmRPA.filterTmp = {
					status: vmRPA.queryParams.status
				}

				vmRPA.table = new NgTableParams({
					count: vmRPA.queryParams.limit
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmRPA.list;
						}
					});
				vmRPA.table.page(vmRPA.queryParams.page);
				vmRPA.loading = false;
			})
		}

		function pageChangeFunc() {
			$scope.vmRPA.queryParams.page = vmRPA.table.page();
			$state.go('.', $scope.vmRPA.queryParams);
		}

		function filterForm() {
			vmRPA.queryParams.page = 1;
			vmRPA.queryParams.status = vmRPA.filterTmp.status;
			$state.go('.', vmRPA.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmRPA.queryParams.name = null;
			vmRPA.queryParams.category = null;
			vmRPA.queryParams.status = null;
			vmRPA.queryParams.tag = null;
			vmRPA.queryParams.dueDate = null;
			$state.go('.', vmRPA.queryParams).then(function () {
				$state.reload();
			});
		}

		function formatTag(item) {
			return item.product.tag_processing.concat(item.product.tag_product);
		}

		function formatCategory(categories) {
			var options = [];
			var createSub = function (category, cates) {
				cates.push(category);
				if (category.sub_category && category.sub_category.length > 0) {
					category.sub_category.forEach(function (sub) {
						return createSub(sub, cates);
					})
				}
				return cates;
			}

			categories.forEach(function (category) {
				var array = createSub(category, []);
				category.sub_cate = array.splice(1);
				options.push(category);
			})
			return options;
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