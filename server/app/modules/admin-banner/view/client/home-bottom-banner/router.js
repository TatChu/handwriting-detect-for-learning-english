;(function(){
	'use strict';

	Application.registerRouter({
		state: 'banner-home-bottom',
		config: {
			url: '/banner-home-bottom',
			data: {
				title: 'banner',
				menuType: 'banner'
			},
			params: {
			},
			templateUrl: 'modules/admin-banner/view/client/home-bottom-banner/view.html',
			controller: 'bannerHomeBottomCtrl',
			controllerAs: 'vmBaHB',
			resolve: bannerHomeBottomCtrl.resolve
		}
	});
})();
