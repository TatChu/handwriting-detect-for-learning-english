/***************************************************
Description: Site configs
****************************************************/
var settingJs = (function () {
	'use strict';

	var currentDate = new Date(),
		// endDate = new Date(2017,0,1,23,59,59),
		host = window.location.host,
		configs = {
			appPrefix: 'Muahangviet',
			facebookAppId: settings.facebookId,
			webUrl: settings.services.webUrl,
			apiUrl: settings.services.apiUrl,
			socketUrl: settings.services.socketApi,
			adminUrl: settings.services.admin,
			userApiUrl: settings.services.apiUrl,
			logApiUrl: settings.services.logApi,
			uploadApiUrl: settings.services.uploadApi,
			uploadDirectory: {
				general: '/files/',
				category: '/files/category_image/',
				product: '/files/product_image/',
				certificate: '/files/certificate_image/',
				blog: '/files/blog_image/',
				banner: '/files/banner_image/',
				thumb: '/files/thumb_image/',
				thumb_product: '/files/thumb_image/product_image/',
				tmp: '/files/tmp/',
				avatar: '/files/avatar_image/',
				media_old: '/files/media_old/',
				media_old_product: '/files/media_old/product/'
			}
		};

	return {
		configs: configs,
		appPrefix: configs.appPrefix,
		storageExpireTime: undefined
		// baseUrl: configs.baseUrl,
		// baseUrlDb: configs.baseUrlDb,
		// hostSubFolder: '/',
		// apiVersion: '',
		// language: 'vi',
		// routers: [],
		// reloadPageOnStateChange: false,
		// enabledHtml5Mode: false,
		// animationDelay: 0,
		// pageTransitionSequence: [
		// {stateName:'home', transition:'0,0'},
		// {stateName:'about', transition:'0,0'},
		// {stateName:'contact', transition:'0,0'}
		// ],
		// pageTransitionLoop: true,
		// pageTransitionDelay: 1500,
		// pageVisibleCount: 5,
		// preloadResource: [
		// ],
		// stopCampaign: currentDate > endDate,
		// facebook: {
		// 	appId: configs.facebookAppId,
		// 	version: 'v2.5',
		// 	permissions: 'email',
		// 	cookie: true,
		// 	xfbml: true,
		// 	language: 'vi_VN',
		// 	redirect: configs.baseUrl
		// },
		// google: {
		// 	api:{
		// 		apiKey: configs.googleApiKey,
		// 		clientId: configs.googleApiClientId,
		// 		scope: [
		// 		'https://www.googleapis.com/auth/plus.login'
		// 		]
		// 	},
		// 	ga: {
		// 		ids: configs.googleAnalyticIds
		// 	}
		// },
		// admin: {
		// 	itemPerPage: '20',
		// 	routers: []
		// },
		// roles: {
		// 	ALL: '*',
		// 	ADMIN: 'admin',
		// 	EDITOR: 'editor',
		// 	REGISTER: 'register',
		// 	GUEST: 'guest'
		// }
	}
})();
