;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editPost',
		config: {
			url: '/blog/edit/{slug}',
			data: {
				title: 'Edit Post',
				menuType: 'blog-post'
			},
			params: {
			},
			templateUrl: 'modules/admin-blog/view/client/edit/view.html',
			controller: 'blogEditCtrl',
			controllerAs: 'vmEditBlog',
			// resolve: blogEditCtrl.resolve
		}
	});
})();
