;(function(){
	'use strict';

	Application.registerRouter({
		state: 'promotion-edit',
		config: {
			url: '/promotion-edit/{id}',
			data: {
				title: 'promotion',
				menuType: 'promotion'
			},
			templateUrl: 'modules/admin-promotion/view/client/edit-promotion/view.html',
			controller: 'promotionEditCtrl',
			controllerAs: 'vmPoE',
			resolve: promotionEditCtrl.resolve
		}
	});
})();
