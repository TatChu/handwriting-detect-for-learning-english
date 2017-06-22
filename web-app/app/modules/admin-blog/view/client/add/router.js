;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createPost',
		config: {
			url: '/blog/add?type',
			data: {
				title: 'Create new Post',
				menuType: 'blog-post'
			},
			params: {
				type: 'GB',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-blog/view/client/add/view.html',
			controller: 'blogAddCtrl',
			controllerAs: 'vmBlogAdd',
			// resolve: blogCtrl.resolve
		}
	});
})();
