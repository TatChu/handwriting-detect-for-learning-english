var categoryListCtrl = (function () {
	'use strict';

	angular
		.module('bzCategory')
		.controller('categoryListCtrl', categoryListCtrl);

	function categoryListCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, categorySvc) {
		/* jshint validthis: true */
		var vmListCategory = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('category', ['view'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmListCategory.query = {
			parrentId: null
		};
		vmListCategory.viewChild = false;
		vmListCategory.loading = true;
		vmListCategory.selectedItems = [];
		vmListCategory.queryParams = $stateParams;
		vmListCategory.userRoles = userRoles;
		vmListCategory.listCategory = [];
		vmListCategory.keyword = $stateParams.keyword;
		
		vmListCategory.imagesDerectory = settingJs.configs.uploadDirectory.category;

		vmListCategory.listCategoriesParrent = [];
		vmListCategory.categoriesParrent = null;
		// Methods
		vmListCategory.search = search;
		vmListCategory.filterReset = filterReset;
		vmListCategory.remove = remove;

		// Init
		if ($stateParams.parrentSlug !== '') //Lọc theo category
		{
			vmListCategory.viewChild = true;
			getCategoryParrentBySlug($stateParams.parrentSlug);
		}
		else {
			getData();
		};

		// Hàm đệ quy lấy tất cả các category cha theo thứ tự từ category level 5 về level 1
		function getListParrentCategory(category){
			if(category.parrent_id != null)
			{
				categorySvc.getById(category.parrent_id)
				.then(function (resp) {
					vmListCategory.listCategoriesParrent.push(resp);
					getListParrentCategory(resp);
				}).catch(function (err) {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Danh mục sản phẩm cha',
							message: err.data.message
						}
					});
				});
			}
			else // Kết thúc và đảo ngược mảng
			{
				vmListCategory.listCategoriesParrent.reverse();
				getData(vmListCategory.query.parrentId);
			}
		}

		function getCategoryParrentBySlug(slug) {
			categorySvc.get(slug)
				.then(function (resp) {
				vmListCategory.query.parrentId = resp._id;
				vmListCategory.categoriesParrent = resp;

				getListParrentCategory(resp);
				}).catch(function (err) {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Danh mục sản phẩm cha',
							message: err.data.message
						}
					});
				});
		}
		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmListCategory.queryParams.page = vmListCategory.table.page();
			$state.go('.', $scope.vmListCategory.queryParams);
		}, $scope, vmListCategory.table);

		function getData(id) {
			if (vmListCategory.viewChild) {
				bzResourceSvc.api($window.settings.services.admin + '/category_child/' + id)
					.get(vmListCategory.queryParams, function (resp) {
						vmListCategory.queryParams.pageCount = resp.totalPage;
						vmListCategory.listCategory = resp.items;

						vmListCategory.table = new NgTableParams({ count: 10 }, {
							counts: [],
							getData: function (params) {
								params.total(resp.totalItems);
								return vmListCategory.listCategory;
							}
						});
						vmListCategory.table.page(vmListCategory.queryParams.page);
						vmListCategory.loading = false;
					});
			}
			else {
				//fix pagining
				bzResourceSvc.api($window.settings.services.admin + '/category')
					.get(vmListCategory.queryParams, function (resp) {
						vmListCategory.queryParams.pageCount = resp.totalPage;
						vmListCategory.listCategory = resp.items;

						vmListCategory.table = new NgTableParams({ count: 10 }, {
							counts: [],
							getData: function (params) {
								params.total(resp.totalItems);
								return vmListCategory.listCategory;
							}
						});
						vmListCategory.table.page(vmListCategory.queryParams.page);
						vmListCategory.loading = false;
					});
			}

		}

		function getChildCategory(id) {
			let promise = categorySvc.getChild(vmListCategory.queryParams, id);
			return promise;
		}

		function remove(id) {
			getChildCategory(id).then(function (resp) {
				if (resp.totalItems > 0) {
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'assets/global/message/view.html',
						controller: function ($scope, $uibModalInstance) {
							$scope.popTitle = 'Không thể xóa';
							$scope.message = 'Bạn không thể xóa danh mục cha. Vui lòng xóa các danh mục con trước';
							$scope.ok = function () {
								$state.go('categories', { parrentId: id });
								$uibModalInstance.close();
							};
							$scope.cancel = function () {
								$state.go('categories', { parrentId: null });
								$uibModalInstance.close();
							};
						}
					});
				}
				else {
					var selected = { ids: [id] }; //id ? {ids: [id]} : getSelectedIds();
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'assets/global/message/view.html',
						controller: function ($scope, $uibModalInstance) {
							$scope.popTitle = 'Xóa';
							$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
							$scope.ok = function () {
								bzResourceSvc.api($window.settings.services.admin + '/category/:id', { id: '@id' })
									.delete({ id: selected.ids }, function (resp) {
										$bzPopup.toastr({
											type: 'success',
											data: {
												title: 'Xóa',
												message: 'Xóa danh mục thành công!'
											}
										});
										$state.reload();
										$uibModalInstance.close();
									});
							};
						}
					});
				}
			}).catch(function (err) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Có lỗi xảy ra trong khi xóa',
						message: err.data.message
					}
				});
			});;
		}
		function search(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmListCategory.queryParams.page,
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmListCategory.queryParams.page,
			}, { notify: false })
				.then(function () {
					$state.reload();
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