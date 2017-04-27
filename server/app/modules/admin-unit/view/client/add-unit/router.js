;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createUnit',
		config: {
			url: '/units/add',
			data: {
				title: 'Create new Unit',
				menuType: 'unit'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-unit/view/client/add-unit/view.html',
			controller: 'unitAddCtrl',
			controllerAs: 'vmAddUnits',
			// resolve: unitsCtrl.resolve
		}
	});
})();
