;(function(){
	'use strict';

	Application.registerRouter({
		state: 'tag-product',
		config: {
			url: '/tag-product?type&tag',
			data: {
				title: 'Tag',
				menuType: 'tag-product'
			},
			params: {
				type: 'SP'
			},
			templateUrl: 'modules/admin-tag/view/client/tag-product/view.html',
			controller: 'tagProductCtrl',
			controllerAs: 'vmTagProduct',
			// resolve: tagCtrl.resolve
		}
	});
})();
