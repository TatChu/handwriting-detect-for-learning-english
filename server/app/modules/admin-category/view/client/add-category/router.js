;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createCategory',
		config: {
			url: '/category/add/{parrentId}',
			data: {
				title: 'Create new Category',
				menuType: 'category'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-category/view/client/add-category/view-add.html',
			controller: 'categoryAddCtrl',
			controllerAs: 'vmcategoryAdd',
			resolve: categoryAddCtrl.resolve
		}
	});
})();
