'use strict';
const _ = require('lodash');
const moment = require("moment");
const async = require('asyncawait/async');
const asyncCao = require('async');
const await = require('asyncawait/await');
const globalWeb = global.configManager.getData();

module.exports = {
    autoPopulateCate,
    getCategorySub,
    getCategoryParent,
    createOptDueDate,
    createOptBanner,
    checkImgOld,
    createOptDueDateObj
};

// Auto create obj populate
function autoPopulateCate(path, count, obj) {
    if (typeof count == 'undefined') {
        var category_level = global.config.web.category_level;
        var count = category_level || 5;
        var obj = {};
    }
    if (count == 0) {
        return obj;
    }
    return {
        path: path,
        populate: autoPopulateCate(path, count - 1)
    };
}

function getCategorySub(category, cates_id) {
    cates_id.push(category._id);
    if (category.sub_category && category.sub_category.length > 0) {
        category.sub_category.forEach(function (sub) {
            return getCategorySub(sub, cates_id);
        })
    }
    return cates_id;
}

function getCategoryParent(category) {
    if (category.parent_category) return getCategoryParent(category.parent_category);
    return category;
}

function createOptDueDate(and_opt) {
    let time_present = moment();
    and_opt.active = true;
    return {
        $and: [
            and_opt,
            {
                $or: [
                    { 'due_date.end_date': null },
                    {
                        'due_date.end_date': {
                            $gte: time_present
                        }
                    }
                ]
            }
        ]
    }
}

function createOptDueDateObj() {
    let time_present = moment();
    return {
        $or: [
            { 'due_date.end_date': null },
            {
                'due_date.end_date': {
                    $gte: time_present
                }
            }
        ]
    }
}

function createOptBanner(page, position, type, category) {
    let opt = {
        page: page,
        position: position,
        type: type,
        status: true
    };

    if (category) {
        opt.category = category;
    }
    return opt;
}

function checkImgOld(new_url, image) {
    let tmp_arr = image.split('/');
    if (tmp_arr.length > 1) {
        let url = globalWeb.web.upload.oldMediaPathProduct.slice(0, -1);
        return url + image;
    }
    return new_url + image;
}