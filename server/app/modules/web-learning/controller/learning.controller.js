'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const Vocabulary = mongoose.model('Vocabulary');

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
	let unit = request.params.unit || null;
	Vocabulary.find({ unit: unit }).exec().then(function (vocabularys) {
		return reply.view('web-learning/view/client/learning/learning', {
			vocabularys,
			menu: { learning: true }
		}, { layout: 'web/layout' });
	}).catch(function (err) {
		return reply.redirect('/error404');
	})

}