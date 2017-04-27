;(function(){
	'use strict';

	Application.registerRouter({
		state: 'promotion-add',
		config: {
			url: '/promotion-add',
			data: {
				title: 'promotion',
				menuType: 'promotion'
			},
			templateUrl: 'modules/admin-promotion/view/client/add-promotion/view.html',
			controller: 'promotionAddCtrl',
			controllerAs: 'vmPoA',
			resolve: promotionAddCtrl.resolve
		}
	});
})();
