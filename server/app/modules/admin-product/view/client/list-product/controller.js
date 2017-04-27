var productListCtrl = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('productListCtrl', productListCtrl);

	function productListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, productSvc, statusProduct) {
		var vmPrL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', 'view')))) {
			$state.go('error403');
		}

		vmPrL.showBtnAdd = authSvc.hasPermission('product', 'add');
		vmPrL.showBtnEdit = authSvc.hasPermission('product', ['add', 'edit']);
		vmPrL.showBtnDelete = authSvc.hasPermission('product', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmPrL.loading = true;
		vmPrL.queryParams = $stateParams;
		vmPrL.setting = settingJs;
		vmPrL.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmPrL.statusProduct = statusProduct;
		vmPrL.btnExport = false;

		// Methods
		vmPrL.activeProduct = activeProduct;
		vmPrL.deleteProduct = deleteProduct;
		vmPrL.filterForm = filterForm;
		vmPrL.clearFilter = clearFilter;
		vmPrL.dueDate = dueDate;
		vmPrL.formatTag = formatTag;
		vmPrL.checkImgOld = productSvc.checkImgOld;
		vmPrL.exportExcel = exportExcel;

		// Init
		getData();

		function pageChangeFunc() {
			$scope.vmPrL.queryParams.page = vmPrL.table.page();
			$state.go('.', $scope.vmPrL.queryParams);
		}

		ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmPrL.table);

		/*FUNCTION*/
		function getData() {
			productSvc.getAll(vmPrL.queryParams).then(function (resp) {
				vmPrL.queryParams.pageCount = resp.totalPage;
				vmPrL.totalItems = resp.totalItems;
				vmPrL.list = resp.items;
				vmPrL.categoryList = resp.categoryList;
				vmPrL.optionsCate = formatCategory(resp.categoryWithSub);
				vmPrL.tagList = resp.tagList;
				vmPrL.filterTmp = {
					// status: vmPrL.queryParams.status ? vmPrL.queryParams.status : vmPrL.statusProduct[0].value
					status: vmPrL.queryParams.status
				}

				vmPrL.table = new NgTableParams({
					count: vmPrL.queryParams.limit
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmPrL.list;
						}
					});
				vmPrL.table.page(vmPrL.queryParams.page);
				vmPrL.loading = false;
			});
		}

		// Active / Unactive Product
		function activeProduct(product) {
			product.active = !product.active;
			var textActive = product.active ? 'bỏ công khai' : 'công khai';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = '';
					$scope.message = 'Bạn muốn ' + textActive + ' sản phẩm này?';

					$scope.ok = function () {
						productSvc.activeProduct(product._id).then(function (resp) {
							product.active = !product.active;
							$uibModalInstance.close();
						});
					}
				}
			});
		}

		// Delete Product
		function deleteProduct(id, key) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa sản phẩm này?';

					$scope.ok = function () {
						productSvc.deleteProduct(id).then(function (resp) {
							if (resp.success) {
								vmPrL.queryParams.page = 1;
								$state.go('.', vmPrL.queryParams).then(function () {
									$state.reload();
									$uibModalInstance.close();

									$bzPopup.toastr({
										type: 'success',
										data: {
											title: 'Thành công!',
											message: 'Xóa sản phẩm thành công!'
										}
									});
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa sản phẩm thất bại!'
								}
							});
						});
					}
				}
			});
		}

		function filterForm(form) {
			vmPrL.queryParams.page = 1;
			vmPrL.queryParams.status = vmPrL.filterTmp.status;
			$state.go('.', vmPrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmPrL.queryParams.name = null;
			vmPrL.queryParams.active = null;
			vmPrL.queryParams.category = null;
			vmPrL.queryParams.status = null;
			vmPrL.queryParams.tag = null;
			vmPrL.queryParams.dueDate = null;
			$state.go('.', vmPrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function dueDate(end_date) {
			if (end_date) {
				var today = moment();
				end_date = moment(end_date);
				return moment(today).isBefore(end_date);
			}
		}

		function formatTag(product) {
			return product.tag_processing.concat(product.tag_product);
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

		// Export Excel
		function exportExcel(list_data) {
			vmPrL.btnExport = true;
			var data = [[
				'STT', 'Tên sản phẩm', 'Đơn giá', 'Giá khuyến mãi', 'Danh mục', 'Đơn vị', 'Đơn vị hiển thị', 'Publish',
			]];
			var options = {
				type: 'xlsx',
				sheetName: 'SheetJS1',
				fileName: 'Product',
			};
			var query = (JSON.parse(JSON.stringify(vmPrL.queryParams)));
			query.limit = vmPrL.totalItems;

			productSvc.getAll(query).then(function (resp) {
				resp.items.forEach(function (item, index) {
					let category_txt = '';
					item.category_list.forEach(function (cate, key) {
						if (key != 0) {
							category_txt += ', '
						}
						category_txt += cate.name;
					});

					var price_after_coupon = '';
					if (item.promotion) {
						switch (item.promotion.type) {
							case 'PC':
								price_after_coupon = item.price * (100 - item.promotion.value) / 100;
								break;
							case 'MN':
								price_after_coupon = item.price - item.promotion.value;
								break;
						}
					}

					data.push([
						index + 1, item.name, item.price, price_after_coupon, category_txt, item.unit.name, item.view_unit, item.active ? 'Có' : 'Không',
					]);
				});
				ExcelJs.exportExcel(data, options);
				vmPrL.btnExport = false;
			}).catch(function (error) {
				console.log(error);
				vmPrL.btnExport = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Xuất Excel thất bại!'
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