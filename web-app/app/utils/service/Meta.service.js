'use strict';

const meta = require(BASE_PATH + '/app/utils/meta.js');
let internals = {};

exports.register = function (server, options, next) {
	const config = server.plugins['hapi-kea-config'];

	server.expose('getMeta', getMeta);
	server.expose('setMeta', setMeta);

	/*
	* lấy meta trong meta.js
	*/
	function getMeta(pageName) {
		return Object.assign(config.get('web.context.app'), meta[pageName]);
	}

	/*
	* gán meta trong meta.js
	*/
	function setMeta(metaData, metaName, value ) {
		metaData[metaName] = value;

		return metaData;
	}

	next();
};

exports.register.attributes = {
	name: 'service-meta'
};

