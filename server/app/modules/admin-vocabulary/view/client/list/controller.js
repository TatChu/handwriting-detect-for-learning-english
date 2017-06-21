var vocabularysCtrl = (function () {
	'use strict';

	angular
		.module('bzVocabulary')
		.controller('vocabularysCtrl', vocabularysCtrl);

	function vocabularysCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, customResourceSrv, vocabularySvc, listClasses) {
		/* jshint validthis: true */
		var vmVocabularys = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('vocabulary', ['view'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmVocabularys.loading = true;
		vmVocabularys.selectedItems = [];
		vmVocabularys.queryParams = $stateParams;
		vmVocabularys.listClasses = listClasses;

		vmVocabularys.userRoles = userRoles;

		vmVocabularys.vocabularys = [];
		vmVocabularys.imagesDirectory = settingJs.configs.uploadDirectory.vocabulary;
		// Methods
		vmVocabularys.filter = filter;
		vmVocabularys.filterReset = filterReset;
		vmVocabularys.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmVocabularys.queryParams.page = vmVocabularys.table.page();
			$state.go('.', $scope.vmVocabularys.queryParams);
		}, $scope, vmVocabularys.table);

		function getData() {
			customResourceSrv.api($window.settings.services.admin + '/vocabulary')
				.get(vmVocabularys.queryParams, function (resp) {
					vmVocabularys.queryParams.pageCount = resp.totalPage;
					vmVocabularys.listVocabulary = resp.items;
					var limit = $stateParams.limit || 10;
					vmVocabularys.table = new NgTableParams({ count: limit }, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmVocabularys.listVocabulary;
						}
					});
					vmVocabularys.table.page(vmVocabularys.queryParams.page);
					vmVocabularys.loading = false;
				});

			// vocabularySvc.getAll(vmVocabularys.queryParams).then(function (resp) {
			// 	vmVocabularys.queryParams.pageCount = resp.totalPage;
			// 	vmVocabularys.listVocabulary = resp.items;
			// 	var limit = $stateParams.limit || 10;
			// 	vmVocabularys.table = new NgTableParams({ count: limit }, {
			// 		counts: [],
			// 		getData: function (params) {
			// 			params.total(resp.totalItems);
			// 			return vmVocabularys.listVocabulary;
			// 		}
			// 	});
			// 	vmVocabularys.table.page(vmVocabularys.queryParams.page);
			// 	vmVocabularys.loading = false;
			// }).catch(function (err) {
			// 	console.log('Can not get data: ', err);
			// });
		}

		function filter(keyword) {
			$state.go('.', {
				class: vmVocabularys.queryParams.class != "" ? vmVocabularys.queryParams.class : null,
				keyword: keyword,
				page: 1
			}).then(function () {
				$state.reload();
			});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				class: null,
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
						customResourceSrv.api($window.settings.services.admin + '/vocabulary/:id', { id: '@id' })
							.delete({ id: selected.ids }, function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Xóa',
										message: 'Xóa từ vựng thành công!'
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