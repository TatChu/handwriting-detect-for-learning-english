;(function(){
	'use strict';

	Application.registerRouter({
		state: 'search-list',
		config: {
			url: '/search?page&limit',
			data: {
				title: 'Search',
				menuType: 'search'
			},
			params: {
				page: '1',
				limit: '20'
			},
			templateUrl: 'modules/admin-search/view/client/list-search/view.html',
			controller: 'searchListCtrl',
			controllerAs: 'vmSeL',
			resolve: searchListCtrl.resolve
		}
	});
})();
