;(function(){
	'use strict';

	Application.registerRouter({
		state: 'tag-processing',
		config: {
			url: '/tag-processing?type',
			data: {
				title: 'Tag',
				menuType: 'tag-processing'
			},
			params: {
				type: 'CN'
			},
			templateUrl: 'modules/admin-tag/view/client/tag-processing/view.html',
			controller: 'tagProcesssingCtrl',
			controllerAs: 'vmTagProcessing',
			// resolve: tagCtrl.resolve
		}
	});
})();
