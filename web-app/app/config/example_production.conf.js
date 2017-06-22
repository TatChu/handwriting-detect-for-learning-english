'use strict';

let config = {};

config.web = {
	context: {
		settings: {
			services: {
                admin: 'http://test.com',
				userApi: 'http://test.com',
				contactApi: 'http://test.com',
				socketApi: 'http://test.com',
				uploadApi: 'http://test.com',
				webUrl: 'http://test.com'
			}
		}
	}
};

module.exports = config;