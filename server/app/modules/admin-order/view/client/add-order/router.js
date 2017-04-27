;(function(){
	'use strict';

	Application.registerRouter({
		state: 'order-add',
		config: {
			url: '/order-add',
			data: {
				title: 'Order add',
				menuType: 'order'
			},
			params: {
				page: '1',
				limit: '10'
			},
			templateUrl: 'modules/admin-order/view/client/add-order/view.html',
			controller: 'orderAddCtrl',
			controllerAs: 'vmOrA',
			resolve: orderAddCtrl.resolve
		}
	});
})();
