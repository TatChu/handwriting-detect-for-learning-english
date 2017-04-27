'use strict';

let config = {};

config.web = {
	context: {
		settings: {
			services: {
				admin: 'http://dev.bizzon.com.vn:9000',
				userApi: 'http://dev.bizzon.com.vn:9001',
				contactApi: 'http://dev.bizzon.com.vn:9001',
				socketApi: 'http://dev.bizzon.com.vn:9001',
				uploadApi: 'http://dev.bizzon.com.vn:9001',
				webUrl: 'http://dev.bizzon.com.vn:9006'
			}
		}
	}
};

module.exports = config;