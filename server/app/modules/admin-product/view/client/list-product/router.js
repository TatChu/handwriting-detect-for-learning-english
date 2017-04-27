;(function(){
	'use strict';

	Application.registerRouter({
		state: 'product',
		config: {
			url: '/product?page&limit&name&status&active&category&tag&dueDate',
			data: {
				title: 'Product',
				menuType: 'product'
			},
			params: {
				page: '1',
				limit: '10',
			},
			templateUrl: 'modules/admin-product/view/client/list-product/view.html',
			controller: 'productListCtrl',
			controllerAs: 'vmPrL',
			resolve: productListCtrl.resolve
		}
	});
})();
