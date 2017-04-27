var importProductListCtrl = (function () {
	'use strict';

	angular
		.module('bzImportProduct')
		.controller('importProductListCtrl', importProductListCtrl);

	function importProductListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, $filter,
		NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, importProductSvc) {
		var vmIPr = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('import_product', 'view')))) {
			$state.go('error403');
		}

		vmIPr.showBtnAdd = authSvc.hasPermission('import_product', 'add');
		vmIPr.showBtnDelete = authSvc.hasPermission('import_product', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmIPr.loading = true;
		vmIPr.queryParams = $stateParams;

		// Methods
		vmIPr.filterForm = filterForm;
		vmIPr.clearFilter = clearFilter;
		vmIPr.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmIPr.queryParams.page = vmIPr.table.page();
			$state.go('.', $scope.vmIPr.queryParams);
		}, $scope, vmIPr.table);

		/*FUNCTION*/
		function getData() {
			/*Start: set datetime picker*/
			var dateTimePickerOpt = {
				singleDatePicker: false
			};

			if (vmIPr.queryParams.date) {
				var date = vmIPr.queryParams.date.split(' - ');
				angular.extend(dateTimePickerOpt, {
					startDate: date[0],
					endDate: date[1],
				});
				angular.element('#datetime-picker').val(vmIPr.queryParams.date);
			}
			vmIPr.dateTimePickerOpt = dateTimePickerOpt;
			/*End: set datetime picker*/

			importProductSvc.getAll(vmIPr.queryParams).then(function (resp) {
				vmIPr.filter = {};
				vmIPr.queryParams.pageCount = resp.totalPage;
				vmIPr.list = resp.items;
				vmIPr.params = resp.params;

				if (vmIPr.queryParams.slug) {
					vmIPr.filter.product = vmIPr.params.product.name;
				}

				if (vmIPr.queryParams.product) {
					vmIPr.filter.product = vmIPr.queryParams.product;
				}

				vmIPr.table = new NgTableParams({
					count: vmIPr.queryParams.limit
				}, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmIPr.list;
						}
					});

				vmIPr.table.page(vmIPr.queryParams.page);
				vmIPr.loading = false;
			})
		}

		function filterForm(form) {
			vmIPr.queryParams.page = 1;
			if (vmIPr.filter.date) {
				vmIPr.queryParams.date = formatMomentDate(vmIPr.filter.date.startDate) + ' - ' + formatMomentDate(vmIPr.filter.date.endDate);
			}
			if (vmIPr.filter.product || vmIPr.filter.product === '') {
				vmIPr.queryParams.product = vmIPr.filter.product;
			}
			if (vmIPr.queryParams.slug) {
				vmIPr.queryParams.slug = null;
			}
			$state.go('.', vmIPr.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmIPr.queryParams.product = null;
			vmIPr.queryParams.slug = null;
			vmIPr.queryParams.date = null;

			$state.go('.', vmIPr.queryParams).then(function () {
				$state.reload();
			});
		}

		function formatMomentDate(date) {
			return date.format('DD/MM/YYYY');
		}

		function remove(import_product) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = '';
					$scope.message = 'Bạn có chắc xoá lịch sử nhập hàng này?';

					$scope.ok = function () {
						if (import_product.qty_before > import_product.product.qty_in_stock) {
							$uibModalInstance.close();
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Thất bại!',
									message: 'Số lượng sản phẩm trong kho nhỏ hơn số lượng nhập hàng.'
								}
							});
						}
						else {
							importProductSvc.del(import_product._id).then(function (resp) {
								$state.go('.', vmIPr.queryParams).then(function () {
									$state.reload();
								});
								$uibModalInstance.close();

								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Thành công!',
										message: 'Xóa lịch sử thành công!'
									}
								});
							}).catch(function (err) {
								$uibModalInstance.close();
								console.log(err);
								$bzPopup.toastr({
									type: 'err',
									data: {
										title: 'Lỗi!',
										message: 'Xóa lịch sử thành công!'
									}
								});
							})
						}
					}
				}
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