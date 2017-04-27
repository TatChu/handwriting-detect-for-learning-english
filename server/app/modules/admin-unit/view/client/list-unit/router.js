;(function(){
	'use strict';

	Application.registerRouter({
		state: 'units',
		config: {
			url: '/units?page&limit&sort&role&id&keyword',
			data: {
				title: 'Unit',
				menuType: 'unit'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '20'
			},
			templateUrl: 'modules/admin-unit/view/client/list-unit/view.html',
			controller: 'unitsCtrl',
			controllerAs: 'vmUnits',
			// resolve: unitsCtrl.resolve
		}
	});
})();
