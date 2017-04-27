;(function(){
	'use strict';

	Application.registerRouter({
		state: 'importProductHistory',
		config: {
			url: '/suppliers/history-import-product/{id}?page&limit',
			data: {
				title: 'Import Product History',
				menuType: 'supplier'
			},
			params: {
				page: '1',
				// sort: '-created',
				limit: '10'
			},
			templateUrl: 'modules/admin-supplier/view/client/import-product-history/view.html',
			controller: 'supplierImportProductHistoryCtrl',
			controllerAs: 'vmSupplierImportProductHistory',
			// resolve: supplierImportProductHistoryCtrl.resolve
		}
	});
})();
