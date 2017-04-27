;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editSupplier',
		config: {
			url: '/suppliers/edit/{id}',
			data: {
				title: 'Update info Supplier',
				menuType: 'supplier'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-supplier/view/client/edit-supplier/view-edit.html',
			controller: 'supplierEditCtrl',
			controllerAs: 'vmsupplierEdit',
			// resolve: suppliersCtrl.resolve
		}
	});
})();
