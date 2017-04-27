var bannerListCtrl = (function () {
	'use strict';

	angular
		.module('bzBanner')
		.controller('bannerListCtrl', bannerListCtrl);

	function bannerListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, bannerSvc) {
		var vmBaL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('banner', ['view'])))) {
			$state.go('error403');
		}
		vmBaL.showBtnAdd = authSvc.hasPermission('banner', 'add');
		vmBaL.showBtnEdit = authSvc.hasPermission('banner', ['add', 'edit']);
		vmBaL.showBtnDelete = authSvc.hasPermission('banner', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmBaL.loading = true;
		vmBaL.urlImg = settingJs.configs.uploadDirectory.banner;

		// Methods
		vmBaL.deleteBanner = deleteBanner;

		// Init
		getData();


		/*FUNCTION*/
		function getData() {
			bannerSvc.getAll({}).then(function (resp) {
				vmBaL.data = resp.data;
				vmBaL.table = new NgTableParams({},
					{
						counts: [],
						dataset: vmBaL.data
					});
				vmBaL.loading = false;
			})
		}

		function deleteBanner(id) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa banner này?';

					$scope.ok = function () {
						bannerSvc.del(id).then(function (resp) {
							if (resp.success) {
								$state.go('.', vmBaL.queryParams).then(function () {
									$state.reload();
									$uibModalInstance.close();

									$bzPopup.toastr({
										type: 'success',
										data: {
											title: 'Thành công!',
											message: 'Xóa banner thành công!'
										}
									});
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa banner thất bại!'
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