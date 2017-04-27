;(function(){
	'use strict';

	Application.registerRouter({
		state: 'import-product',
		config: {
			url: '/import-product?page&limit&slug&product&date',
			data: {
				title: 'Import Product',
				menuType: 'import-product'
			},
            params: {
				page: '1',
				limit: '20'
			},
			templateUrl: 'modules/admin-import-product/view/client/list-import-product/view.html',
			controller: 'importProductListCtrl',
			controllerAs: 'vmIPr',
			resolve: importProductListCtrl.resolve
		}
	});
})();
