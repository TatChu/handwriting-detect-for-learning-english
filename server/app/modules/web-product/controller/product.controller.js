'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require("moment");
const _ = require('lodash');
var async = require('asyncawait/async');
var asyncCao = require('async');
var await = require('asyncawait/await');
var Promise = require('bluebird');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const slug = require('slug');
const sanitizeHtml = require('sanitize-html');

const Product = mongoose.model('Product');
const productHelper = require('../util/product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Order = mongoose.model('Order');

// Cate = Category
module.exports = {
    category,
    detail,
    search,
    hightlight
};

// Category page
function category(request, reply) {
    let category = request.pre.getCategory;
    let tag_processing = request.pre.getTagsProcessing;
    let parrentCategory = request.pre.getParentCategory;
    let tag_product = request.pre.getTagsHighlight.concat(request.pre.getTagsMostSell).concat({
        "_id": "",
        "name": "Sản phẩm Khuyến mãi",
        "description": "Sản phẩm Khuyến mãi",
    });
    let time_present = moment();
    let filter = setFilter(request.query.filter, tag_processing);

    if (request.params.slug && !category) {
        return reply.redirect('/error404');
    }
    if (request.params.category && !parrentCategory) {
        return reply.redirect('/error404');
    }

    // Check is isset category

    if (!parrentCategory) {
        parrentCategory = category;
    }

    asyncCao.parallel({
        tag_processing: function (cb) {
            getProcessingWithCountProduct(category).then(function (resp) {
                cb(null, resp);
            });
        },
        products: function (cb) {
            let sort = setSort(request.query.sort, tag_product);
            asyncFuncProduct({}, category, filter).then(function (resp) {
                cb(null, sortProduct(resp, sort, tag_product[sort]));
            })
        },
        same_category: function (cb) {
            countSameCategory(parrentCategory.top).then(function (resp) {
                cb(null, resp);
            })
        },
        categories: function (cb) {
            getAndCountCategory(parrentCategory).then(function (resp) {
                cb(null, resp);
            })
        }
    }, function (err, result) {
        result.category = category;
        result.tag_product = tag_product;
        result.parrentCategory = parrentCategory;

        const Meta = request.server.plugins['service-meta'];
        var meta = JSON.parse(JSON.stringify(Meta.getMeta('product')));
        meta.title = category.name + meta.title;
        let meta_item = meta.descs.find(function (item) {
            return item.slug == parrentCategory.slug;
        });
        if (meta_item) {
            meta.desc = meta_item.desc;
        }
        // return reply({ data: result.banner_top_item });

        return reply.view('web-product/view/client/category/view', {
            data: result,
            active_menu: parrentCategory.slug,
            active_sub: category.slug,
            meta,
            ga_category: 'ProductCategory'
        }, { layout: 'web/layout' });
    })
}

function search(request, reply) {
    let findCategory = request.pre.findCategory;
    let categoryRauCu = request.pre.findCategoryRauCu;
    let tag_processing = request.pre.getTagsProcessing;
    // let tag_product = request.pre.getTagsProduct;
    let tag_product = request.pre.getTagsHighlight.concat(request.pre.getTagsMostSell).concat({
        "_id": "",
        "name": "Sản phẩm Khuyến mãi",
        "description": "Sản phẩm Khuyến mãi",
    });
    let config = request.server.configManager;
    let time_present = moment();
    request.query.q = sanitizeHtml(request.query.q)
    let search = request.query.q || '';
    let slug_re = slug(search);
    let option_product = [];
    let filter = setFilter(request.query.filter, tag_processing);
    try {
        option_product.push({
            name: new RegExp(search, 'i')
        });

        option_product.push({
            slug: new RegExp(slug_re, 'i')
        });

        const Meta = request.server.plugins['service-meta'];
        var meta = JSON.parse(JSON.stringify(Meta.getMeta('search-result')));

        var extend_common = function (option, filter) {
            if (filter.length > 0) {
                return _.extend(option, {
                    'tag_processing.id_tag': filter
                });
            }
            return option;
        }

        var getData = async(function () {
            // try {
            // Start: Search products
            // Start: Find category
            let category = categoryRauCu;
            if (findCategory) {
                if (findCategory.parrent_id) {
                    let parent_cate = productHelper.getCategoryParent(findCategory);
                    category = await(Category.findById(parent_cate._id).populate(productHelper.autoPopulateCate('sub_category')).lean());
                }
                else {
                    category = findCategory;
                }
            }

            let categories = await(getAndCountCategory(category));
            // End: Find category

            let products = [];
            let product_find = true;

            // Check is find any product
            let common_opt = productHelper.createOptDueDate({
                $or: option_product
            });
            let count_products = await(Product.find(common_opt).count());
            var option_proccess = extend_common(common_opt, filter);
            products = await(Product.find(option_proccess).populate({
                path: 'promotion',
                match: {
                    status: true
                }
            }).lean());

            // Check if not find any product
            if (count_products == 0) {
                product_find = false;
                option_proccess = productHelper.createOptDueDate({
                    category: {
                        $in: productHelper.getCategorySub(categoryRauCu, [])
                    },
                });
                if (filter.length > 0) {
                    option_proccess = productHelper.createOptDueDate({
                        category: {
                            $in: productHelper.getCategorySub(categoryRauCu, [])
                        },
                        'tag_processing.id_tag': {
                            $in: filter
                        }
                    });
                }
                products = await(Product.find(option_proccess).populate({
                    path: 'promotion',
                    match: {
                        status: true
                    }
                }).lean());
            }
            else {
                let first_product = await(Product.findOne(common_opt).lean().select('category'));
                let search_category = await(Category.findById(first_product.category[0])
                    .populate(productHelper.autoPopulateCate('parent_category')).select('parrent_id').lean());
                let parent_cate = productHelper.getCategoryParent(search_category);
                let find_parent_cate = await(Category.findById(parent_cate._id).populate(productHelper.autoPopulateCate('sub_category')).lean())
                categories = await(getAndCountCategory(find_parent_cate));
            }

            tag_processing = await(Tag.find({ type: 'CN' }).populate({
                path: 'proccesing',
                match: option_proccess
            }).lean());

            // End: Search products

            // Sort product
            let sort = setSort(request.query.sort, tag_product);
            products = sortProduct(products, sort, tag_product[sort]);

            return {
                search,
                findCategory,
                categoryRauCu,
                category,
                products,
                product_find,
                tag_processing,
                tag_product,
                categories
            };
        });

        asyncCao.parallel({
            data: function (cb) {
                getData().then(function (resp) {
                    cb(null, resp);
                })
            }
        }, function (err, result) {
            // return reply({ category: result.data.categories });

            return reply.view('web-product/view/client/search-result/view', {
                data: result.data,
                search_txt: search,
                meta,
                ga_category: 'SearchResult'
            }, { layout: 'web/layout' });
        })
    } catch (error) {
        return reply.redirect('/error404');
    }
}

function hightlight(request, reply) {
    let parrentCategory = request.pre.findCategoryRauCu;
    let category = request.pre.getCategory;
    let tagsProduct = request.pre.getTagsProduct;
    let tagsDiscount = request.pre.getTagsDiscount;
    let tag_product = request.pre.getTagsProduct;
    let tag_processing = request.pre.getTagsProcessing;
    let promotes_active = request.pre.getPromotionActive;
    let time_present = moment();
    let category_parrent = request.pre.findCategories;

    try {
        let list_tags_product = tagsDiscount.map(function (item) {
            return item._id;
        });

        let list_promote = promotes_active.map(function (item) {
            return item._id;
        })
        // return reply({ test: list_promote });

        const Meta = request.server.plugins['service-meta'];
        var meta = JSON.parse(JSON.stringify(Meta.getMeta('khuyen-mai')));

        asyncCao.parallel({
            categories: function (cb) {
                countSameCategory(category_parrent).then(function (resp) {
                    cb(null, resp);
                })
            },
            banner_top_item: function (cb) {
                let promise = Banner.find(productHelper.createOptBanner('category', 'top', 'item', 'khuyen-mai')).sort({
                    order: 1
                }).limit(1);

                promise.then(function (resp) {
                    cb(null, resp);
                })
            },
            products: function (cb) {
                let opt_and = {
                    active: true
                };
                if (category) {
                    opt_and.category = {
                        $in: productHelper.getCategorySub(category, [])
                    }
                }
                let promise = Product.find({
                    $and: [opt_and,
                        {
                            $or: [
                                {
                                    id_promotion: {
                                        $in: list_promote
                                    }
                                }
                            ]
                        },
                        {
                            $or: [
                                { 'due_date.end_date': null },
                                {
                                    'due_date.end_date': {
                                        $gte: time_present
                                    }
                                }
                            ]
                        }]
                }).populate('promotion').lean();

                promise.then(function (resp) {
                    cb(null, resp);
                })
            }
        }, function (err, result) {
            if (err) {
                return reply.redirect('/error404');
            }
            result.tagsDiscount = tagsDiscount;
            result.tag_product = tag_product;
            result.tag_processing = tag_processing;
            result.parrentCategory = parrentCategory;
            result.category = category;

            return reply.view('web-product/view/client/khuyen-mai/view', {
                data: result,
                active_menu: 'khuyen-mai',
                meta,
                ga_category: 'ProductCategory'
            }, { layout: 'web/layout' });
        })
    } catch (error) {
        return reply.redirect('/error404');
    }
}

// Product detail page
function detail(request, reply) {
    let config = request.server.configManager;
    let slug = request.params.slug;
    let id = request.params.id;
    let last_month = moment().subtract(1, 'months');
    let configOrder1 = request.pre.getConfigOrder1;
    let configOrder2 = request.pre.getConfigOrder2;
    let getConfigHeader = request.pre.getConfigHeader;
    let user = request.pre.getAuthUser;
    let time_present = moment();

    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('product')));
    let webUrl = config.get('web.context.settings.services.webUrl');
    let url = webUrl + '/san-pham/' + slug + '-' + id;

    asyncCao.parallel({
        product: function (callback) {
            let promise = Product.findById(id)
                .populate('unit certificate_list')
                .populate({
                    path: 'category_list',
                    populate: productHelper.autoPopulateCate('parent_category'),
                })
                .populate({
                    path: 'relative_product_list',
                    populate: {
                        path: 'promotion'
                    },
                    match: productHelper.createOptDueDate({
                    }),
                })
                .populate({
                    path: 'promotion',
                    match: {
                        status: true
                    }
                }).lean();
            promise.then(function (resp) {
                callback(null, resp);
            }).catch(function (err) {
                callback(err, null);
            });
        },
        order: function (callback) {
            let promise = Order.find(
                {
                    'order_detail.product': {
                        $in: [id]
                    }
                }
            ).populate({
                path: 'order_detail.product',
                populate: {
                    path: 'promotion',
                    match: {
                        status: true
                    }
                },
                match: productHelper.createOptDueDate({}),
                select: 'id_unit id_promotion images view_unit thumb promotion name qty_in_stock made_in price slug'
            }).select('order_detail').lean();
            promise.then(function (resp) {
                callback(null, resp);
            }).catch(function (err) {
                callback(err, null);
            });
        }
    }, function (err, result) {
        if (!result.product) {
            return reply.redirect('/error404');
        }
        // Start: Group order
        let order = result.order;
        let tmp_order = [];
        let list_pro_month = [];
        let parent_category = productHelper.getCategoryParent(result.product.category_list[0]);
        // return reply(order);
        order.forEach(function (order_item) {
            order_item.order_detail.forEach(function (order_detail) {
                tmp_order.push(order_detail);
            })
        });

        let index = 0;
        tmp_order.forEach(function (order, key) {
            if (order.product) {
                let find_pro = list_pro_month.find(function (item) {
                    return item.product._id == order.product._id;
                });
                if (!find_pro) {
                    list_pro_month.push({
                        product: order.product,
                        count: order.order_quantity,
                        index: index
                    })
                    index++;
                }
                else {
                    list_pro_month[find_pro.index].count = find_pro.count + order.order_quantity;
                }
            }
        });

        list_pro_month = list_pro_month.sort(function (a, b) {
            return b.count - a.count;
        }).slice(0, 12);
        // End: Group order

        let data = {
            product: result.product,
            list_pro_month,
            configOrder1,
            configOrder2,
            getConfigHeader,
            user,
            url
        };
        // return reply({
        //     data
        // });
        let check_slug = request.params.slug == result.product.slug;

        if (request.query.api) {
            return reply({
                check_slug,
                data
            });
        }
        else {
            // Start: Add meta data
            let meta_item = meta.descs.find(function (item) {
                return item.slug == parent_category.slug;
            });
            meta.og_title = result.product.meta_title;
            meta.og_image = webUrl + productHelper.checkImgOld('/files/thumb_image/product_image/', result.product.thumb);
            meta.title = capitalizeFirstLetter(data.product.name);
            meta.desc = data.product.meta_description;
            meta.og_description = result.product.meta_description;

            // Check isset meta
            if (data.product.meta_description == '' || !data.product.meta_description) {
                meta.desc = meta_item.desc;
                meta.og_description = meta_item.desc;
            }
            if (meta.og_title == '' || !meta.og_title) {
                meta.og_title = capitalizeFirstLetter(data.product.name);
            }
            // End: Add meta data

            // return reply(meta);
            let Domain = request.info.referrer.substring(0, request.info.referrer.indexOf('/san-pham/'));

            if (check_slug) {
                return reply.view('web-product/view/client/detail/view', {
                    data,
                    active_menu: parent_category.slug,
                    parent_category,
                    class: { body_class: 'checkout-mb' },
                    meta,
                    Domain
                }, { layout: 'web/layout' });
            }
            else {
                return reply.redirect('/error404');
            }
        }
        return null;
    })
}

function countSameCategory(sameCategory) {
    return new Promise(function (resolve, reject) {
        let same_category = [];
        let list_func = [];

        sameCategory.forEach(function (category) {
            list_func.push(function (callback) {
                let promise = Product.find(productHelper.createOptDueDate({
                    category: {
                        $in: productHelper.getCategorySub(category, [])
                    }
                })).count();

                promise.then(function (resp) {
                    callback(null, {
                        category,
                        product_count: resp
                    });
                })
            });
        })

        asyncCao.parallel(list_func, function (err, result) {
            resolve(result);
        })
    });
}

var getAndCountCategory = async(function (category) {
    let time_present = moment();
    let categories = {
        category,
        sub_category: []
    };

    let options = function (cates) {
        return productHelper.createOptDueDate({
            category: {
                $in: productHelper.getCategorySub(cates, [])
            },
        })
    };

    category.sub_category.forEach(function (sub) {
        let sub_products_count = await(Product.find(options(sub)).count());
        let sub_obj = {
            category: sub,
            product_count: sub_products_count,
            sub_category: []
        };
        sub.sub_category.forEach(function (child) {
            let child_products_count = await(Product.find(options(child)).count());
            sub_obj.sub_category.push({
                category: child,
                product_count: child_products_count,
                sub_category: []
            });
        });
        categories.sub_category.push(sub_obj);
    })

    return categories;
})

function asyncFuncProduct(option, category, filter) {
    return new Promise(function (resolve, reject) {
        if (filter.length > 0) {
            option = _.extend(option, {
                'tag_processing.id_tag': filter
            });
        }
        let options = _.extend(productHelper.createOptDueDate({
            category: {
                $in: productHelper.getCategorySub(category, [])
            },
        }), option);
        let promise = Product.find(options).populate({
            path: 'promotion',
            match: {
                status: true
            }
        })
            .select('name qty_in_stock made_in price view_unit slug thumb tag_processing tag_product id_promotion promotion')
            .lean();
        promise.then(function (resp) {
            resolve(resp);
        })
    });
}

function getProcessingWithCountProduct(category) {
    return new Promise(function (resolve, reject) {
        let promise = Tag.find({ type: 'CN' }).populate({
            path: 'proccesing',
            match: productHelper.createOptDueDate({
                category: {
                    $in: productHelper.getCategorySub(category, [])
                },
            })
        }).lean();
        promise.then(function (resp) {
            resolve(resp);
        })
    });
}

function sortProduct(products, sort, id_tag) {
    var arrHavePromotion = [];
    var arrHave = [];
    var arrNotHave = [];
    products.forEach(function (item) {
        var findTag = item.tag_product.find(function (tag) {
            return tag.id_tag.toString() == id_tag._id.toString();
        });
        // When sort tag is 'khuyến mãi'
        if (sort == 2) {
            if (item.promotion && item.promotion.status) {
                arrHave.push(item);
            }
            else {
                arrNotHave.push(item);
            }
        }
        // When sort tag is not 'khuyến mãi'
        else {
            if (findTag) {
                arrHave.push(item);
            }
            else {
                arrNotHave.push(item);
            }
        }
    });
    return arrHavePromotion.concat(arrHave).concat(arrNotHave);
}

function setSort(sort, tag_product) {
    let sort_num = 0 || parseInt(sort);
    if (sort_num > tag_product.length - 1) {
        sort_num = 0;
    }

    if (isNaN(sort_num)) {
        sort_num = 0;
    }
    return sort_num;
}

function setFilter(filter_query, tag_processing) {
    let filter = [];
    if (filter_query) {
        let filter_arr = filter_query.split('.');
        filter_arr.forEach(function (item) {
            let check = parseInt(item);
            if (!isNaN(check)) {
                filter.push(tag_processing[parseInt(item)]._id);
            }
        })
    }
    return filter;
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}