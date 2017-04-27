;(function(){
	'use strict';

	Application.registerRouter({
		state: 'promotion-list',
		config: {
			url: '/promotion?page&limit',
			data: {
				title: 'Promotion',
				menuType: 'promotion'
			},
			params: {
				page: '1',
				limit: '20'
			},
			templateUrl: 'modules/admin-promotion/view/client/list-promotion/view.html',
			controller: 'promotionListCtrl',
			controllerAs: 'vmPoL',
			resolve: promotionListCtrl.resolve
		}
	});
})();
