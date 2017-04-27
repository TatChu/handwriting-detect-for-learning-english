;(function(){
	'use strict';

	Application.registerRouter({
		state: 'order-report',
		config: {
			url: '/order-report?page&limit&customer_name&coupon&date&status&type&user&user_id&min_order&max_order',
			data: {
				title: 'Report order',
				menuType: 'order-report'
			},
			params: {
				page: '1',
				limit: '50'
			},
			templateUrl: 'modules/admin-order/view/client/report-order/view.html',
			controller: 'orderReportCtrl',
			controllerAs: 'vmOrR',
			resolve: orderReportCtrl.resolve
		}
	});
})();
