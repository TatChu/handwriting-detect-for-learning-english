"use strict";

var Joi = require('joi');

function SearchValidate() { };
SearchValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    keyword: Joi.string().required(),
                    status: Joi.bool().required()
                }
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var searchValidate = new SearchValidate();
module.exports = searchValidate;
