'use strict'
/***************************************************
PLUGIN AUDIT LOG
***************************************************/
const _ = require('lodash');
const Bluebird = require('bluebird');
const auditLog = require('audit-log');

exports.register = function(server, options, next) {
	const config = server.plugins['hapi-kea-config'];

	auditLog.addTransport("mongoose", {collectionName: 'mhv_auditlogs', connectionString: config.get('web.db.uri') });
	auditLog.addTransport("console");

    // console.log(auditLog.logEvent(
     //		'95049',            //user_id login || ''
     //    'mongoose',         //origin ex: mongoose or route
     //    'updateStatusUser', //action : function name
     //    'users',            // label: module name
     //    JSON.stringify({new:{name:'john.doe'},old:{name:'hoangvu'}}),   //data mới, cũ
     //    'changed status user'    // chi tiết thay đổi
    // ));

    server.expose('auditLog', auditLog);
    server.decorate('request', 'auditLog', auditLog);
    next();
};

exports.register.attributes = {
	name: 'app-auditlog'
};