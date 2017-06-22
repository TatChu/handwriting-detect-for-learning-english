'use strict'
/***************************************************
PLUGIN Access Control List
***************************************************/
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Acl = require('acl');
const Bluebird = require('bluebird');
let internals = {};

exports.register = function(server, options, next) {
	const config = server.plugins['hapi-kea-config'];

	mongodb.connect(config.get('web.db.uri'), function(error, db) {
		let acl = new Acl(new Acl.mongodbBackend(db, 'tb_acl_'));

		server.decorate('server', 'acl', acl);
		server.decorate('request', 'acl', acl);

		next();
	});
};

exports.register.attributes = {
	name: 'app-acl'
};
