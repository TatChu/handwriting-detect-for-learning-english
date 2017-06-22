;(function(){
	'use strict';

	Application.registerRouter({
		state: 'units',
		config: {
			url: '/units?page&limit&id&keyword&class',
			data: {
				title: 'Unit',
				menuType: 'unit'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '15'
			},
			templateUrl: 'modules/admin-unit/view/client/list-unit/view.html',
			controller: 'unitsCtrl',
			controllerAs: 'vmUnits',
			// resolve: unitsCtrl.resolve
		}
	});
})();
