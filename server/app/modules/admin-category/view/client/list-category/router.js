;(function(){
	'use strict';

	Application.registerRouter({
		state: 'categories',
		config: {
			url: '/categories/{parrentSlug}?page&limit&sort&role&id&keyword',
			data: {
				title: 'Categories',
				menuType: 'category'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-category/view/client/list-category/view-list.html',
			controller: 'categoryListCtrl',
			controllerAs: 'vmListCategory',
		}
	});
})();
