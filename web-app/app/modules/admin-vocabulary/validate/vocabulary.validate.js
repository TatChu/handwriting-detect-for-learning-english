"use strict";

var Joi = require('joi');

function VocabularyValidate() { };
VocabularyValidate.prototype = (function () {

    return {
        edit: {
            params: {
                id: Joi.string().description('Id')
            }
        },
        save: {

        },
        update: {
            payload: {
                unit: Joi.string().required().description('ID Uinit'),
                word: Joi.string().required().description('Từ'),
                define: Joi.string().required().allow('').description('Nghĩa'),
                conversation: Joi.string().allow('').description('conversation'),
                sentense_pattern: Joi.object().description('sentense_pattern'),
                lang: Joi.string().allow('').description('Languge'),
                audio_url: Joi.string().allow('').description('audio file'),
                transcribe: Joi.string().allow('').description('Phiên âm'),
                images: Joi.array().items(Joi.object().keys({
                    url: Joi.string().required()
                })).description('List Images'),
                classes: Joi.string().allow('').description('Loại từ'),
                status: Joi.boolean().description('Status'),

                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                __v: Joi.any().optional().description('Version Key'),
                _id: Joi.string().description('MongoID')
            }
        },
        deleteItem: {
            params: {
                id: Joi.string().required().description('ID')
            }
        }
    };
})();

var unitValidate = new VocabularyValidate();
module.exports = unitValidate;
