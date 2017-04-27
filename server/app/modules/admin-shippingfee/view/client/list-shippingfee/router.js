;(function(){
	'use strict';

	Application.registerRouter({
		state: 'shippingfee-list',
		config: {
			url: '/shippingfee-list?page&limit&sort&role&id&keyword',
			data: {
				title: 'ShippingFee',
				menuType: 'shippingfee'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-shippingfee/view/client/list-shippingfee/view.html',
			controller: 'shippingfeeCtrl',
			controllerAs: 'vmShippingFees',
			// resolve: shippingfeeCtrl.resolve
		}
	});
})();
