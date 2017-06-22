'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const dbSqlite = require('./../util/db_sqlite.connect.js');
const dictionaryMiddleware = require('./../middleware/dictionary.middleware.js');

module.exports = {
	dictionary,
	searchDictionary
};

function dictionary(request, reply) {
	return reply.view('web-dictionary/view/client/dictionary/dictionary', {
		menu: { dictionary: true }
	}, { layout: 'web/layout' });
}

function searchDictionary(request, reply) {
	const word = request.params.word;
	const lang = request.params.lang;
	dictionaryMiddleware.searchWord(word, lang, function (res) {
		return reply(res);
	})
}