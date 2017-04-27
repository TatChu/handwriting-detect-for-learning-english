;(function(){
	'use strict';

	Application.registerRouter({
		state: 'order-list',
		config: {
			url: '/order?page&limit&customer_name&coupon&date&status&type&user&user_id&min_order&max_order&export',
			data: {
				title: 'Order list',
				menuType: 'order'
			},
			params: {
				page: '1',
				limit: '50'
			},
			templateUrl: 'modules/admin-order/view/client/list-order/view.html',
			controller: 'orderListCtrl',
			controllerAs: 'vmOrL',
			resolve: orderListCtrl.resolve
		}
	});
})();
