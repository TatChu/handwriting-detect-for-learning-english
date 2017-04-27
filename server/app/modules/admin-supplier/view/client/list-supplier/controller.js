var supplierListCtrl = (function(){
	'use strict';

	angular
	.module('bzSupplier')
	.controller('supplierListCtrl', supplierListCtrl);

	function supplierListCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, supplierSvc){
		/* jshint validthis: true */
		var vmListSupplier = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('supplier', ['view'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmListSupplier.loading = true;
		vmListSupplier.selectedItems = [];
		vmListSupplier.keyword = $stateParams.keyword;
		vmListSupplier.queryParams = $stateParams;

		vmListSupplier.userRoles = userRoles;
		// console.log('test', userRoles);
		vmListSupplier.listSupplier = [];

		// Methods
		vmListSupplier.filter = filter;
		vmListSupplier.filterReset = filterReset;
		vmListSupplier.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmListSupplier.queryParams.page = vmListSupplier.table.page();
			$state.go('.',$scope.vmListSupplier.queryParams);
		}, $scope, vmListSupplier.table);

		function getData(){
			//fix pagining
			bzResourceSvc.api($window.settings.services.admin + '/supplier')
			.get(vmListSupplier.queryParams, function(resp){
				vmListSupplier.queryParams.pageCount = resp.totalPage;
				vmListSupplier.listSupplier = resp.items;
				// console.log('test',vmListSupplier.users);

				vmListSupplier.table = new NgTableParams({count: parseInt(vmListSupplier.queryParams.limit) || 10}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmListSupplier.listSupplier;
					}
				});
				vmListSupplier.table.page(vmListSupplier.queryParams.page);
				vmListSupplier.loading = false;
			});
		}

		function filter(keyword){
			$state.go('.', {
				keyword: keyword,
				page: vmListSupplier.queryParams.page,
			}, {notify:false})
			.then(function(){
				$state.reload();
			});
		}

		function filterReset(){
			$state.go('.', {
				keyword: null,
				page: vmListSupplier.queryParams.page,
			}, {notify:false})
			.then(function(){
				$state.reload();
			});
		}


		function remove(id){
			var selected = {ids: [id]}; //id ? {ids: [id]} : getSelectedIds();
			var modalInstance = $uibModal.open({
				animation:true,
				templateUrl: 'assets/global/message/view.html',
				controller: function($scope, $uibModalInstance){
					$scope.popTitle = 'Xóa'; 
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?'; 
					$scope.ok = function(){
						bzResourceSvc.api($window.settings.services.admin + '/supplier/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa nhà cung cấp thành công!'
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
		preload: function(bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve : resolve
	};
})();