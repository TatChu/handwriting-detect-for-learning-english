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
		vmUsers.exportExcel = exportExcel;
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

		// Export Excel
		function exportExcel(detail) {
			console.log(123123, ExcelJs);
			vmUsers.processingExport = true;
			var data = [[
				'STT', 'Tên tài khoản', 'Điện thoại', 'Email', 'Ngày đăng ký', 'Trạng thái', 'Facebook', 'Ngày sinh'
			]];

			var options = {
				type: 'xlsx',
				sheetName: 'Users',
				fileName: 'User_' + moment(new Date()).format('DD/MM/YYYY'),
			};
			var query = (JSON.parse(JSON.stringify(vmUsers.queryParams)));
			query.limit = vmUsers.totalItems;
			query.page = 1;

			customResourceSrv.api($window.settings.services.apiUrl + '/user')
				.get(query, function (resp) {
					var checkPushData = function (data, value_default, array) {
						if (data && data !== 'undefined') array.push('' + data)
						else array.push(value_default);
						return array;
					}
					resp.items.forEach(function (item, index) {
						var row = [index + 1];
						row = checkPushData(item.name, '', row);
						row = checkPushData(item.phone, '', row);
						row = checkPushData(item.email, '', row);

						var createdAt = moment(item.createdAt).format('DD/MM/YYYY');
						row.push(createdAt);


						if (item.status) row.push('Acitve')
						else row.push('Inactive');

						if (item.provider_id) {
							row.push(('https://www.fb.com/' + item.provider_id));
						}
						else row.push('');

						if (item.dob) {
							var dob = moment(item.dob).format('DD/MM/YYYY');
							row.push(dob);
						}
						else row.push('');

						data.push(row);

					})

					ExcelJs.exportExcel(data, options);
					vmUsers.processingExport = false;

				}, function (err) {
					console.log(err);
					vmUsers.btnExport = false;
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Thất bại',
							message: 'Không thể xuất. Hãy thử lại'
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