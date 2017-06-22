; (function () {
	'use strict';

	Application.registerRouter({
		state: 'blogsPost',
		config: {
			url: '/blog-post?page&limit&sort&role&id&keyword&type&tag',
			data: {
				title: 'Blogs Post',
				menuType: 'blog-post'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
				type: 'GB'
			},
			templateUrl: 'modules/admin-blog/view/client/list/view-post.html',
			controller: 'blogListCtrl',
			controllerAs: 'vmListBlog',
			resolve: blogListCtrl.resolve
		}
	});

	Application.registerRouter({
		state: 'blogsPolicy',
		config: {
			url: '/blogs-policy?page&limit&sort&role&id&keyword&type',
			data: {
				title: 'Blogs Policy',
				menuType: 'blog-policy'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
				type: 'CS'
			},
			templateUrl: 'modules/admin-blog/view/client/list/view-policy.html',
			controller: 'blogListCtrl',
			controllerAs: 'vmListBlog',
			resolve: blogListCtrl.resolve
		}
	});

	Application.registerRouter({
		state: 'blogsBanner',
		config: {
			url: '/blogs-banner?page&limit&sort&role&id&keyword&type',
			data: {
				title: 'Blogs Banner',
				menuType: 'blog-banner'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
				type: 'BN'
			},
			templateUrl: 'modules/admin-blog/view/client/list/view-banner.html',
			controller: 'blogListCtrl',
			controllerAs: 'vmListBlog',
			resolve: blogListCtrl.resolve
		}
	});

	Application.registerRouter({
		state: 'blogsTip',
		config: {
			url: '/blogs-tip?page&limit&sort&role&id&keyword&type',
			data: {
				title: 'Blogs Tips',
				menuType: 'blog-tip'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10',
				type: 'MV'
			},
			templateUrl: 'modules/admin-blog/view/client/list/view-tip.html',
			controller: 'blogListCtrl',
			controllerAs: 'vmListBlog',
			resolve: blogListCtrl.resolve
		}
	});

})();
