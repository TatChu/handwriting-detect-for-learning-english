;(function(){
	'use strict';

	Application.registerRouter({
		state: 'report-product-order',
		config: {
			url: '/report-product-order?page&limit&name&status&active&category&tag&dueDate&date&qty_in_stock&total_order',
			data: {
				title: 'Report Product Order',
				menuType: 'report-product-order'
			},
			params: {
				page: '1',
				limit: '10',
			},
			templateUrl: 'modules/admin-report/view/client/list-report-product-order/view.html',
			controller: 'reportProductOrderCtrl',
			controllerAs: 'vmRPO',
			resolve: reportProductOrderCtrl.resolve
		}
	});
})();
