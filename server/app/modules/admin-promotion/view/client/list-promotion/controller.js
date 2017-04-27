var promotionListCtrl = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('promotionListCtrl', promotionListCtrl);

	function promotionListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, promotionSvc) {
		var vmPoL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('promotion','view') ))){
            $state.go('error403');
        }

		vmPoL.showBtnAdd = authSvc.hasPermission('promotion','add');
		vmPoL.showBtnEdit = authSvc.hasPermission('promotion',['add','edit']);
		vmPoL.showBtnDelete = authSvc.hasPermission('promotion','delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmPoL.loading = true;
		vmPoL.queryParams = $stateParams;
		vmPoL.urlImg = settingJs.configs.uploadDirectory.product;

		// Methods
		vmPoL.remove = remove;

		// Init
		getData();

		function pageChangeFunc() {
			$scope.vmPoL.queryParams.page = vmPoL.table.page();
			$state.go('.', $scope.vmPoL.queryParams);
		}

		ngTableEventsChannel.onPagesChanged(pageChangeFunc, $scope, vmPoL.table);

		/*FUNCTION*/
		function getData() {
			promotionSvc.getAll(vmPoL.queryParams).then(function (resp) {
				vmPoL.queryParams.pageCount = resp.totalPage;
				vmPoL.list = resp.items;

				vmPoL.table = new NgTableParams({
					count: vmPoL.queryParams.limit
				},
					{
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmPoL.list;
						}
					});
				vmPoL.table.page(vmPoL.queryParams.page);
				vmPoL.loading = false;
			});
		}


		// Delete Product
		function remove(id) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa promotion này?';

					$scope.ok = function () {
						promotionSvc.delete(id).then(function (resp) {
							if (resp.success) {
								vmPoL.queryParams.page = 1;
								$state.go('.', vmPoL.queryParams).then(function () {
									$state.reload();
									$uibModalInstance.close();

									$bzPopup.toastr({
										type: 'success',
										data: {
											title: 'Thành công!',
											message: 'Xóa promotion thành công!'
										}
									});
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa promotion thất bại!'
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