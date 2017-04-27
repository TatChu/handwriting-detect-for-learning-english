var configListCtrl = (function () {
	'use strict';

	angular
		.module('bzConfig')
		.controller('configListCtrl', configListCtrl);

	function configListCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, configSvc) {
		/* jshint validthis: true */
		var vmListConfig = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('config', ['view'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmListConfig.loading = true;
		vmListConfig.selectedItems = [];
		vmListConfig.keyword = $stateParams.keyword;
		vmListConfig.queryParams = $stateParams;

		vmListConfig.userRoles = userRoles;
		// console.log('test', userRoles);
		vmListConfig.listSupplier = [];

		// Methods
		vmListConfig.filter = filter;
		vmListConfig.filterReset = filterReset;
		vmListConfig.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmListConfig.queryParams.page = vmListConfig.table.page();
			$state.go('.', $scope.vmListConfig.queryParams);
		}, $scope, vmListConfig.table);

		function getData() {
			//fix pagining
			bzResourceSvc.api($window.settings.services.admin + '/config')
				.get(vmListConfig.queryParams, function (resp) {
					vmListConfig.queryParams.pageCount = resp.totalPage;
					vmListConfig.listSupplier = resp.items;
					// console.log('test',vmListConfig.users);

					vmListConfig.table = new NgTableParams({ count: parseInt(vmListConfig.queryParams.limit) || 10 }, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmListConfig.listSupplier;
						}
					});
					vmListConfig.table.page(vmListConfig.queryParams.page);
					vmListConfig.loading = false;

				});
		}

		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmListConfig.queryParams.page,
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmListConfig.queryParams.page,
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}


		function remove(id) {
			var selected = { ids: [id] }; //id ? {ids: [id]} : getSelectedIds();
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						bzResourceSvc.api($window.settings.services.admin + '/config/:id', { id: '@id' })
							.delete({ id: selected.ids }, function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Config',
										message: 'Deleted!'
									}
								});
								$state.reload();
								$uibModalInstance.close();
							});
					};
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