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
		let acl = new Acl(new Acl.mongodbBackend(db, 'mhv_acl_'));

		// const  aclCustom = {
		// 	findAllRoles: internals.findAllRoles(db),
		// };
		
		

		// acl.addUserRoles( 'roles', ['admin', 'super-admin']);
		// acl.addUserRoles( '586f6ca8c43c0316e71810d2', ['admin', 'super-admin']);

		server.decorate('server', 'acl', acl);
		server.decorate('request', 'acl', acl);
		// server.decorate('request', 'aclCustom', aclCustom);

		next();
	});
};

exports.register.attributes = {
	name: 'app-acl'
};

/*======================Internals=============================*/

// internals.getCollection =  function(db){
// 	return new Promise((resolve, reject) => {
// 		resolve(db.collection("mhv_acl_roles"));
// 	});
// }

// internals.findAllRoles = function (db){
// 	return new Promise((resolve, reject) => {
// 		internals.getCollection(db).then(function(collection){
// 			collection.find({}).toArray((err, roles) => {
// 				if (err) reject(err);
// 				else resolve(roles);
// 			});
// 		}); 
// 	});
// }
