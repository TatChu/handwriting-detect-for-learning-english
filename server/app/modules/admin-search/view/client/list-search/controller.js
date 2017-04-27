var searchListCtrl = (function () {
	'use strict';

	angular
		.module('bzSearch')
		.controller('searchListCtrl', searchListCtrl);

	function searchListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, searchSvc) {
		var vmSeL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('search', 'view')))) {
			$state.go('error403');
		}
		vmSeL.showBtnAdd = authSvc.hasPermission('search', 'add');
		vmSeL.showBtnEdit = authSvc.hasPermission('search', ['add', 'edit']);
		vmSeL.showBtnDelete = authSvc.hasPermission('search', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmSeL.loading = true;
		vmSeL.queryParams = $stateParams;
		vmSeL.urlImg = settingJs.configs.uploadDirectory.product;

		// Methods
		vmSeL.activeSearch = activeSearch;
		vmSeL.deleteSearch = deleteSearch;

		// Init
		getData();

		function pageChangeFunc() {
			$scope.vmSeL.queryParams.page = vmSeL.table.page();
			$state.go('.', $scope.vmSeL.queryParams);
		}

		ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmSeL.table);

		/*FUNCTION*/
		function getData() {
			searchSvc.getAll(vmSeL.queryParams).then(function (resp) {
				vmSeL.queryParams.pageCount = resp.totalPage;
				vmSeL.list = resp.items;

				vmSeL.table = new NgTableParams({
					count: vmSeL.queryParams.limit
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmSeL.list;
						}
					});
				vmSeL.table.page(vmSeL.queryParams.page);
				vmSeL.loading = false;
			})
		}

		// Active / Unactive Product
		function activeSearch(item) {
			item.status = !item.status;
			var textActive = item.status ? 'bỏ công khai' : 'công khai';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = '';
					$scope.message = 'Bạn muốn ' + textActive + ' từ khóa này?';

					$scope.ok = function () {
						searchSvc.active(item._id).then(function (resp) {
							item.status = !item.status;
							$uibModalInstance.close();
						});
					}
				}
			});
		}

		// Delete Product
		function deleteSearch(id) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa từ khóa này?';

					$scope.ok = function () {
						searchSvc.del(id).then(function (resp) {
							if (resp.success) {
								vmSeL.queryParams.page = 1;
								$state.go('.', vmSeL.queryParams).then(function () {
									$state.reload();
									$uibModalInstance.close();

									$bzPopup.toastr({
										type: 'success',
										data: {
											title: 'Thành công!',
											message: 'Xóa từ khóa thành công!'
										}
									});
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa từ khóa thất bại!'
								}
							});
						});
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