;(function(){
	'use strict';

	Application.registerRouter({
		state: 'search-add',
		config: {
			url: '/search-add',
			data: {
				title: 'Search',
				menuType: 'search'
			},
			templateUrl: 'modules/admin-search/view/client/add-search/view.html',
			controller: 'searchAddCtrl',
			controllerAs: 'vmSeA',
			resolve: searchAddCtrl.resolve
		}
	});
})();
