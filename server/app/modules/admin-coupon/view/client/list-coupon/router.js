;(function(){
	'use strict';

	Application.registerRouter({
		state: 'coupon-list',
		config: {
			url: '/coupon-list?page&limit&sort&role&id&keyword',
			data: {
				title: 'Coupon',
				menuType: 'coupon'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '20'
			},
			templateUrl: 'modules/admin-coupon/view/client/list-coupon/view.html',
			controller: 'couponCtrl',
			controllerAs: 'vmCoupons',
			// resolve: couponCtrl.resolve
		}
	});
})();
