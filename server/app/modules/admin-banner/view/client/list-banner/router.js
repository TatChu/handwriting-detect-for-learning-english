;(function(){
	'use strict';

	Application.registerRouter({
		state: 'banner-list',
		config: {
			url: '/banner',
			data: {
				title: 'banner',
				menuType: 'banner'
			},
			params: {
			},
			templateUrl: 'modules/admin-banner/view/client/list-banner/view.html',
			controller: 'bannerListCtrl',
			controllerAs: 'vmBaL',
			resolve: bannerListCtrl.resolve
		}
	});
})();
