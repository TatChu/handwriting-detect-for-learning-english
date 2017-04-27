;(function(){
	'use strict';

	Application.registerRouter({
		state: 'suppliers',
		config: {
			url: '/suppliers?page&limit&sort&role&id&keyword',
			data: {
				title: 'Suppliers',
				menuType: 'supplier'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-supplier/view/client/list-supplier/view-list.html',
			controller: 'supplierListCtrl',
			controllerAs: 'vmListSupplier',
			resolve: supplierListCtrl.resolve
		}
	});
})();
