var blogListCtrl = (function () {
	'use strict';

	angular
		.module('bzBlog')
		.controller('blogListCtrl', blogListCtrl);

	function blogListCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, blogSvc) {
		/* jshint validthis: true */
		var vmListBlog = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('blog', ['view'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmListBlog.loading = true;
		vmListBlog.selectedItems = [];
		vmListBlog.keyword = $stateParams.keyword;
		vmListBlog.queryParams = $stateParams;
		vmListBlog.imagesDirectory = settingJs.configs.uploadDirectory.blog;

		vmListBlog.userRoles = userRoles;
		vmListBlog.listBlog = [];
		vmListBlog.typeBlog = $stateParams.type || 'GB'; // defalt GB if param null
		vmListBlog.filter = filter;
		vmListBlog.filterReset = filterReset;
		vmListBlog.remove = remove;

		// Init
		getData();
		getListTag();

		// event
		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmListBlog.queryParams.page = vmListBlog.table.page();
			$state.go('.', $scope.vmListBlog.queryParams);
		}, $scope, vmListBlog.table);

		// Methods

		function getData() {
			//fix pagining
			bzResourceSvc.api($window.settings.services.admin + '/blog')
				.get(vmListBlog.queryParams, function (resp) {
					vmListBlog.queryParams.pageCount = resp.totalPage;
					vmListBlog.listBlog = resp.items;

					vmListBlog.table = new NgTableParams({ count: parseInt(vmListBlog.queryParams.limit) || 10 }, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmListBlog.listBlog;
						}
					});
					vmListBlog.table.page(vmListBlog.queryParams.page);
					vmListBlog.loading = false;
				});
		}

		function getListTag() {
			blogSvc.getTagsBlog().then(function (resp) {
				if (resp.success) {
					vmListBlog.listTag = resp.data;
				}
			});
		}

		function filter(keyword) {
			$state.go('.', {
				keyword: vmListBlog.queryParams.keyword,
				page: vmListBlog.queryParams.page,
				tag: vmListBlog.queryParams.tag
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmListBlog.queryParams.page,
				tag: null
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}


		function remove(slug) {
			var selected = { ids: [slug] }; //id ? {ids: [id]} : getSelectedIds();
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						bzResourceSvc.api($window.settings.services.admin + '/blog/:id', { id: '@id' })
							.delete({ id: selected.ids }, function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Xóa',
										message: 'Xóa vài viết thành công'
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