;(function(){
	'use strict';

	Application.registerRouter({
		state: 'product-add',
		config: {
			url: '/product-add',
			data: {
				title: 'Product',
				menuType: 'product'
			},
			templateUrl: 'modules/admin-product/view/client/add-product/view.html',
			controller: 'productAddCtrl',
			controllerAs: 'vmPrA',
			resolve: productAddCtrl.resolve
		}
	});
})();
