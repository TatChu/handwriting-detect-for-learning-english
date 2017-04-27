;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editConfig',
		config: {
			url: '/config/edit/{id}',
			data: {
				title: 'Edit Config',
				menuType: 'config'
			},
			params: {
			},
			templateUrl: 'modules/admin-config/view/client/edit/view.html',
			controller: 'configEditCtrl',
			controllerAs: 'vmEditConfig',
			// resolve: configEditCtrl.resolve
		}
	});
})();
