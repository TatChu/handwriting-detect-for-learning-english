var reportProductOrderCtrl = (function () {
	'use strict';

	angular
		.module('bzReport')
		.controller('reportProductOrderCtrl', reportProductOrderCtrl);

	function reportProductOrderCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, reportSvc, productSvc) {
		var vmRPO = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', 'view')))) {
			$state.go('error403');
		}

		vmRPO.showBtnAdd = authSvc.hasPermission('order', 'add');
		vmRPO.showBtnEdit = authSvc.hasPermission('order', ['add', 'edit']);
		vmRPO.showBtnDelete = authSvc.hasPermission('order', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmRPO.loading = true;
		vmRPO.queryParams = $stateParams;
		vmRPO.setting = settingJs;
		vmRPO.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmRPO.filter = {};

		// Methods
		vmRPO.filterForm = filterForm;
		vmRPO.clearFilter = clearFilter;
		vmRPO.checkImgOld = productSvc.checkImgOld;

		// Init
		getData();

		function pageChangeFunc() {
			$scope.vmRPO.queryParams.page = vmRPO.table.page();
			$state.go('.', $scope.vmRPO.queryParams);
		}

		// ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmRPO.table);
		ngTableEventsChannel.onAfterReloadData(function () {
			var sort = vmRPO.table.sorting();
			if (!angular.equals(sort, {})) {
				$scope.vmRPO.queryParams.qty_in_stock = sort.qty_in_stock;
				$scope.vmRPO.queryParams.total_order = sort.total_order;
			}
			pageChangeFunc();
		}, $scope, vmRPO.table);

		/*FUNCTION*/
		function getData() {
			/*Start: set datetime picker*/
			var dateTimePickerOpt = {
				singleDatePicker: false
			};

			if (vmRPO.queryParams.date) {
				var date = vmRPO.queryParams.date.split(' - ');
				angular.extend(dateTimePickerOpt, {
					startDate: date[0],
					endDate: date[1],
				});
				angular.element('#datetime-picker').val(vmRPO.queryParams.date);
			}
			vmRPO.dateTimePickerOpt = dateTimePickerOpt;
			/*End: set datetime picker*/


			reportSvc.reportProductOrder(vmRPO.queryParams).then(function (resp) {
				vmRPO.queryParams.pageCount = resp.totalPage;
				vmRPO.list = resp.items;
				vmRPO.categoryList = resp.categories;
				vmRPO.optionsCate = formatCategory(resp.categoryWithSub);

				vmRPO.table = new NgTableParams({
					count: vmRPO.queryParams.limit,
					sorting: {
						qty_in_stock: vmRPO.queryParams.qty_in_stock,
						total_order: vmRPO.queryParams.total_order
					},
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmRPO.list;
						},
					});
				vmRPO.table.page(vmRPO.queryParams.page);
				vmRPO.loading = false;
			}).catch(function (err) {
				console.log(err);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Lấy dữ liệu thất bại!'
					}
				});
			})
		}

		function filterForm() {
			vmRPO.queryParams.page = 1;

			if (vmRPO.filter.date) {
				vmRPO.queryParams.date = formatDate(vmRPO.filter.date.startDate) + ' - ' + formatDate(vmRPO.filter.date.endDate);
			}

			$state.go('.', vmRPO.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmRPO.queryParams.name = null;
			vmRPO.queryParams.category = null;
			vmRPO.queryParams.date = null;
			vmRPO.queryParams.total_order = null;
			vmRPO.queryParams.qty_in_stock = null;
			$state.go('.', vmRPO.queryParams).then(function () {
				$state.reload();
			});
		}

		function formatDate(date) {
			return date.format('DD/MM/YYYY');
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