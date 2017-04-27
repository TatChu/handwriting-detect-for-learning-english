;(function(){
	'use strict';

	Application.registerRouter({
		state: 'order-edit',
		config: {
			url: '/order/{id}',
			data: {
				title: 'Order edit',
				menuType: 'order'
			},
			templateUrl: 'modules/admin-order/view/client/edit-order/view.html',
			controller: 'orderEditCtrl',
			controllerAs: 'vmOrE',
			resolve: orderEditCtrl.resolve
		}
	});
})();
