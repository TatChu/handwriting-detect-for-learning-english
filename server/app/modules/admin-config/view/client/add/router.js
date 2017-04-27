;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createConfig',
		config: {
			url: '/configs/add',
			data: {
				title: 'Create new Config',
				menuType: 'config'
			},
			params: {
			},
			templateUrl: 'modules/admin-config/view/client/add/view.html',
			controller: 'configAddCtrl',
			controllerAs: 'vmAddConfigs'
		}
	});
})();
