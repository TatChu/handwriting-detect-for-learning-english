;(function(){
	'use strict';

	Application.registerRouter({
		state: 'tag-list',
		config: {
			url: '/tag-list?page&limit&sort&role&id&keyword',
			data: {
				title: 'Tag',
				menuType: 'tag'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-tag/view/client/list-tag/view.html',
			controller: 'tagCtrl',
			controllerAs: 'vmTags',
			// resolve: tagCtrl.resolve
		}
	});
})();
