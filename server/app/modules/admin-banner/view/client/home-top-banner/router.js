;(function(){
	'use strict';

	Application.registerRouter({
		state: 'banner-home-top',
		config: {
			url: '/banner-home-top',
			data: {
				title: 'banner',
				menuType: 'banner'
			},
			params: {
			},
			templateUrl: 'modules/admin-banner/view/client/home-top-banner/view.html',
			controller: 'bannerHomeTopCtrl',
			controllerAs: 'vmBaHT',
			resolve: bannerHomeTopCtrl.resolve
		}
	});
})();
