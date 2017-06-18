var usersCtrl = (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('usersCtrl', usersCtrl);

	function usersCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, userRoles, authSvc, NgTableParams, ngTableEventsChannel, customResourceSrv) {
		/* jshint validthis: true */
		var vmUsers = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!authSvc.isSuperAdmin()) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmUsers.loading = true;
		vmUsers.selectedItems = [];
		vmUsers.queryParams = $stateParams;
		vmUsers.keyword = $stateParams.keyword;
		vmUsers.role = $stateParams.role;
		vmUsers.status = $stateParams.status;
		vmUsers.userRoles = userRoles;
		// console.log('test', userRoles);
		vmUsers.users = [];

		// Methods
		vmUsers.filter = filter;
		vmUsers.filterReset = filterReset;
		vmUsers.active = active;
		vmUsers.sort = sort;
		vmUsers.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmUsers.queryParams.page = vmUsers.table.page();
			$state.go('.', $scope.vmUsers.queryParams);
		}, $scope, vmUsers.table);

		function getData() {
			customResourceSrv.api($window.settings.services.apiUrl + '/user')
				.get(vmUsers.queryParams, function (resp) {
					vmUsers.queryParams.pageCount = resp.totalPage;
					vmUsers.users = resp.items;
					vmUsers.table = new NgTableParams({ count: parseInt(vmUsers.queryParams.limit) || 10 }, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmUsers.users;
						}
					});
					vmUsers.table.page(vmUsers.queryParams.page);
					vmUsers.loading = false;
				}, function (err) {
					console.log(err);
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'User',
							message: err.data.message
						}
					});
				});
		}

		function filter(keyword) {
			$state.go('.', {
				role: vmUsers.role != "" ? vmUsers.role : null,
				keyword: keyword,
				status: vmUsers.status != "" ? vmUsers.status : null,
				page: 1
			}).then(function () {
				$state.reload();
			});
		}

		function filterReset() {
			$state.go('.', {
				role: null,
				keyword: null,
				page: vmUsers.queryParams.page,
				status: null,
				// publish: null,
				// cateid: null,
				// limit: settingJs.admin.itemPerPage
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		function active(id, value) {
			customResourceSrv.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
				.update({ _id: id }, { status: value }, function (resp) {
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'User',
							message: value === 1 ? 'Kích hoạt tài khoản thành công!' : 'Vô hiệu hóa tài khoản thành công!'
						}
					});

					$state.reload();
				});
		}

		function sort(id, value) {
			$bzPopup.toastr({
				type: 'success',
				data: {
					title: 'Cập nhật',
					message: 'Cập nhật thứ tự bài viết thành công!'
				}
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
						customResourceSrv.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
							.delete({ id: selected.ids }, function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Xóa',
										message: 'Xóa tài khoản thành công!'
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