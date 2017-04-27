;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editCategory',
		config: {
			url: '/category/edit/{slug}',
			data: {
				title: 'Edit new Category',
				menuType: 'category'
			},
			params: {
				// page: '1',
				// sort: '-editd',
				// limit: '10'
			},
			templateUrl: 'modules/admin-category/view/client/edit-category/view-edit.html',
			controller: 'categoryEditCtrl',
			controllerAs: 'vmcategoryEdit',
			// resolve: categoryCtrl.resolve
		}
	});
})();
