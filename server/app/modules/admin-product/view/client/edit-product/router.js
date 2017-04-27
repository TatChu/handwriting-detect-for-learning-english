;(function(){
	'use strict';

	Application.registerRouter({
		state: 'product-edit',
		config: {
			url: '/product-edit/{id}',
			data: {
				title: 'Product',
				menuType: 'product'
			},
			templateUrl: 'modules/admin-product/view/client/edit-product/view.html',
			controller: 'productEditCtrl',
			controllerAs: 'vmPrE',
			resolve: productEditCtrl.resolve
		}
	});
})();
