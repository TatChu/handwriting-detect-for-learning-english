'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');

module.exports = {
	listUnit,
	learning,
};


function listUnit(request, reply) {
	let user_id = request.auth.credentials.uid;
	let classes = '4';
	if (user_id == '')
		return reply.redirect('/error403');
	User.findById(user_id).lean().then(function (user) {
		if (user && user.classes) {
			classes = user.classes
		};

		return Unit.find({ classes: classes }).exec().then(function (units) {
			return reply.view('web-learning/view/client/list-unit/list-unit', {
				units,
				user,
				menu: { learning: true }
			}, { layout: 'web/layout' });
		}).catch(function (err) {
			return reply.redirect('/')
		})
	}).catch(function (err) {
		console.log(err)
		return reply.redirect('/error404')
	})
}

function learning(request, reply) {
	return reply.view('web-learning/view/client/learning/learning', {
		menu: { learning: true }
	}, { layout: 'web/layout' });
}