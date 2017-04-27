;(function(){
	'use strict';

	Application.registerRouter({
		state: 'report-product-a-day',
		config: {
			url: '/report-product-a-day?page&limit&name&status&active&category&tag&dueDate',
			data: {
				title: 'Report Product A Day',
				menuType: 'report-product-a-day'
			},
			params: {
				page: '1',
				limit: '10',
			},
			templateUrl: 'modules/admin-report/view/client/list-report-product-a-day/view.html',
			controller: 'reportProductADayCtrl',
			controllerAs: 'vmRPA',
			resolve: reportProductADayCtrl.resolve
		}
	});
})();
