;(function(){
	'use strict';

	Application.registerRouter({
		state: 'import-product-add',
		config: {
			url: '/import-product-add',
			data: {
				title: 'Import Product',
				menuType: 'import-product'
			},
			templateUrl: 'modules/admin-import-product/view/client/add-import-product/view.html',
			controller: 'importProductCtrl',
			controllerAs: 'vmIPr',
			resolve: importProductCtrl.resolve
		}
	});
})();
