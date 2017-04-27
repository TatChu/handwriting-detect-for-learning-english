;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createSupplier',
		config: {
			url: '/suppliers/add',
			data: {
				title: 'Create new Supplier',
				menuType: 'supplier'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-supplier/view/client/add-supplier/view-add.html',
			controller: 'supplierAddCtrl',
			controllerAs: 'vmsupplierAdd',
			// resolve: suppliersCtrl.resolve
		}
	});
})();
