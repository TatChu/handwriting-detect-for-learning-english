;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editUnit',
		config: {
			url: '/units/edit/{id}',
			data: {
				title: 'Edit Unit',
				menuType: 'unit'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-unit/view/client/edit-unit/view.html',
			controller: 'unitEditCtrl',
			controllerAs: 'vmEditUnits',
			// resolve: unitsCtrl.resolve
		}
	});
})();
