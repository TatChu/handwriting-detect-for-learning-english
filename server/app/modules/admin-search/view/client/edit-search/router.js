;(function(){
	'use strict';

	Application.registerRouter({
		state: 'search-edit',
		config: {
			url: '/search-edit/{id}',
			data: {
				title: 'Search',
				menuType: 'search'
			},
			templateUrl: 'modules/admin-search/view/client/edit-search/view.html',
			controller: 'searchEditCtrl',
			controllerAs: 'vmSeE',
			resolve: searchEditCtrl.resolve
		}
	});
})();