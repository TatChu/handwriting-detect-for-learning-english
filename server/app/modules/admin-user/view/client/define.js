(function () {
	'use strict';

	angular
		.module('bzUser')
		.constant('userRoles', [
			{ name: 'Super Admin', value: 'super-admin' },
			{ name: 'Admin', value: 'admin' },
			{ name: 'User', value: 'user' },
			{ name: 'Học viên', value: 'student' }
		]);
})();