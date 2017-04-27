var supplierImportProductHistoryCtrl = (function () {
	'use strict';

	angular
		.module('bzSupplier')
		.controller('supplierImportProductHistoryCtrl', supplierImportProductHistoryCtrl);

	function supplierImportProductHistoryCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, supplierSvc) {
		var vmSupplierImportProductHistory = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('supplier', ['edit', 'export'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
        vmSupplierImportProductHistory.loading = true;
		vmSupplierImportProductHistory.queryParams = $stateParams;
        vmSupplierImportProductHistory.supplier = {};

		// Methods
        function getSupplier(){
            const id = $stateParams.id;
            supplierSvc.get(id).then(function(res){
                vmSupplierImportProductHistory.supplier = res;
            }).catch(function (err){
                 $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Nhà cung cấp',
                            message: err.data.message
                        }
                    });
            });
        };

		// Init
        getSupplier();
		getData();
        
        ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmSupplierImportProductHistory.queryParams.page = vmSupplierImportProductHistory.table.page();
			$state.go('.',$scope.vmSupplierImportProductHistory.queryParams);
		}, $scope, vmSupplierImportProductHistory.table);


		/*FUNCTION*/
		function getData() {
            bzResourceSvc.api($window.settings.services.admin + '/supplier/import-product/' + $stateParams.id)
			.get(vmSupplierImportProductHistory.queryParams, function(resp){
				vmSupplierImportProductHistory.filter = {};
                vmSupplierImportProductHistory.queryParams.pageCount = resp.totalPage;
				vmSupplierImportProductHistory.list = resp.items;
				vmSupplierImportProductHistory.params = resp.params;

				vmSupplierImportProductHistory.table = new NgTableParams({
					count: vmSupplierImportProductHistory.queryParams.limit
				}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmSupplierImportProductHistory.list;
					}
				});

				vmSupplierImportProductHistory.table.page(vmSupplierImportProductHistory.queryParams.page);
				vmSupplierImportProductHistory.loading = false;
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