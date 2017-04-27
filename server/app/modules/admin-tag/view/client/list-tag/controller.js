var tagCtrl = (function(){
	'use strict';

	angular
	.module('bzTag')
	.controller('tagCtrl', tagCtrl);

	function tagCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, tagSvc){
		/* jshint validthis: true */
		var vmTags = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag','view') ))){
            $state.go('error403');
        }

		vmTags.showBtnAdd = authSvc.hasPermission('tag','add');
		vmTags.showBtnEdit = authSvc.hasPermission('tag',['add','edit']);
		vmTags.showBtnDelete = authSvc.hasPermission('tag','delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmTags.loading = true;
		vmTags.selectedItems = [];
		vmTags.queryParams = $stateParams;
		vmTags.keyword = $stateParams.keyword;
		vmTags.userRoles = userRoles;
		// console.log('test', userRoles);
		vmTags.tags = [];

		// Methods
		vmTags.filter = filter;
		vmTags.filterReset = filterReset;
		vmTags.sort = sort;
		vmTags.remove = remove;
		vmTags.checkType = checkType;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmTags.queryParams.page = vmTags.table.page();
			$state.go('.',$scope.vmTags.queryParams);
		}, $scope, vmTags.table);

		function getData(){
			bzResourceSvc.api($window.settings.services.admin + '/tag')
			.get(vmTags.queryParams, function(resp){
				vmTags.queryParams.pageCount = resp.totalPage;
				vmTags.tags = resp.items;
				console.log('test',vmTags.tags);

				vmTags.table = new NgTableParams({count: 10}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmTags.tags;
					}
				});
				vmTags.table.page(vmTags.queryParams.page);
				vmTags.loading = false;
			});
		}

		
		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmTags.queryParams.page,
			}).then(function () {
				$state.reload();
			});
		}

		
		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmTags.queryParams.page,
				// publish: null,
				// cateid: null,
				// limit: settingJs.admin.itemPerPage
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		

		function sort(id, value){
			$bzPopup.toastr({
				type: 'success',
				data:{
					title: 'Cập nhật',
					message: 'Cập nhật thứ tự nhãn thành công!'
				}
			});
		}

		function remove(id){
			var selected = {ids: [id]}; //id ? {ids: [id]} : getSelectedIds();
			console.log('asd',id);

			var modalInstance = $uibModal.open({
				animation:true,
				templateUrl: 'assets/global/message/view.html',
				controller: function($scope, $uibModalInstance){
					$scope.popTitle = 'Xóa'; 
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?'; 
					$scope.ok = function(){
						bzResourceSvc.api($window.settings.services.admin + '/tag/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa nhãn thành công!'
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

	function checkType(type){
		if(type === "SP")
			return "Sản phẩm";
		if(type === "CN")
			return "Cách nấu";	
		if(type === "BL")
			return "Bài viết";		
	}

	var resolve = {
		/* @ngInject */
		preload: function(bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve : resolve
	};
})();