;(function(){
	'use strict';

	Application.registerRouter({
		state: 'banner-category-top',
		config: {
			url: '/banner-category-top',
			data: {
				title: 'banner',
				menuType: 'banner'
			},
			params: {
			},
			templateUrl: 'modules/admin-banner/view/client/category-top-banner/view.html',
			controller: 'bannerCategoryTopCtrl',
			controllerAs: 'vmBaCT',
			resolve: bannerCategoryTopCtrl.resolve
		}
	});
})();
