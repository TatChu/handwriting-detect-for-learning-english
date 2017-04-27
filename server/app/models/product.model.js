'use strict';
const conf = global.config;
const prefixCollection = global.config.web.db.prefixCollection || '';

const esConf = conf.web.elasticsearch;
const sycnES = esConf.ES_Sync || false;
const elasticsearch = require('elasticsearch');
const mongoosastic = require('mongoosastic');
const _ = require('lodash');
const Bluebird = require('bluebird');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const ProductSchema = new Schema({
    old_id: {
        type: Number,
        default: null,
    },
    name: {
        type: String,
        required: 'Please fill name'
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        enum: ['HSV', 'CH', 'SHH'],
        default: 'HSV'
    },
    tag_product: [{
        _id: false,
        id_tag: {
            type: Schema.ObjectId,
            ref: 'Tag'
        },
        expire_date: {
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    tag_processing: [{
        _id: false,
        id_tag: {
            type: Schema.ObjectId,
            ref: 'Tag'
        },
        expire_date: {
            startDate: {
                type: Date,
                default: null
            },
            endDate: {
                type: Date,
                default: null
            },
        }
    }],
    category: [{
        type: Schema.ObjectId,
        ref: 'Category',
        required: 'Please add category'
    }],
    id_unit: {
        type: Schema.ObjectId,
        required: 'Please select unit',
        ref: 'Unit',
    },
    view_unit: {    //show ra ngoài web 
        type: String,
        default: ''
    },
    other_is: { // check trường hợp con gà, trái bưởi
        type: Boolean,
        default: false
    },
    other_price: { // giá ? kg/con 
        type: String,
        default: ''
    },
    qty_in_stock: {
        type: Number,
        min: 0
    },
    price: {
        type: Number,
        min: 0
    },
    due_date: {
        start_date: {
            type: Date
        },
        end_date: {
            type: Date
        }
    },
    id_promotion: {
        type: Schema.ObjectId,
        ref: 'Promotion',
    },
    images: [{
        _id: false,
        url: {
            type: String
        }
    }],
    thumb: {
        type: String,
        default: ''
    },
    videos: [{
        _id: false,
        url: {
            type: String
        }
    }],
    short_description: {
        type: String
    },
    detail_infor: {
        type: String
    },
    made_in: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    relative_product: [{
        type: Schema.ObjectId,
        ref: 'Product',
    }],
    // vat: {
    //     type: Boolean,
    //     default: true
    // },
    certificates: [{
        type: Schema.ObjectId,
        ref: 'Certificate',
    }],
    meta_title: {
        type: String,
        default: ''
    },
    meta_keywords: {
        type: String,
        default: ''
    },
    meta_description: {
        type: String,
        default: '',
        maxlength: 255
    }
}, {
        collection: prefixCollection + 'product',
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    });

/******************************************************************
Pre Action
*******************************************************************/

// List pre function
// let preSave = function (next) {
//     console.log(this);
//     next();
// }

// ProductSchema.pre('update', function(next) {
//     // Create slug
//     if (!this.slug) {
//         this.slug = slug(this.name);
//     }
//     this.slug = this.slug.toLowerCase();
//     next();
// });

// ProductSchema.pre('save', preSave);

/******************************************************************
Virtual Populate
*******************************************************************/

// Virtual Unit
ProductSchema.virtual('unit', {
    ref: 'Unit',
    localField: 'id_unit',
    foreignField: '_id',
    justOne: true
});

// Virtual Relative Product
ProductSchema.virtual('relative_product_list', {
    ref: 'Product',
    localField: 'relative_product',
    foreignField: '_id'
});

// Virtual Category
ProductSchema.virtual('category_list', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id'
});

// Virtual Promotion
ProductSchema.virtual('promotion', {
    ref: 'Promotion',
    localField: 'id_promotion',
    foreignField: '_id',
    justOne: true
});

// Virtual Order
ProductSchema.virtual('order_product', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'order_detail.product'
});

// Virtual Certificate
ProductSchema.virtual('certificate_list', {
    ref: 'Certificate',
    localField: 'certificates',
    foreignField: '_id'
});

// ProductSchema.virtual('tags',{
//     ref: 'Tag',
//     localField: 'tag.id_tag',
//     foreignField: '_id'
// });
// End: Virtual Populate


/*Create Elastic Search For Product Model*/
let defaultSetting = {
    defer: function () { return Bluebird.defer(); }
};
let settings = _.merge({}, defaultSetting, esConf.config);
let esClient = new elasticsearch.Client(settings);
ProductSchema.plugin(mongoosastic, { index: esConf.prefixIndex + '_products', esClient: esClient });
let Product = mongoose.model('Product', ProductSchema);

if (sycnES) {
    /*Đồng bộ với colection đã tồn tại*/
    let stream = Product.synchronize({}, { saveOnSynchronize: true })
        , count = 0;

    stream.on('data', function (err, doc) {
        count++;
    });
    stream.on('close', function () {
        console.log('Product indexed ' + count + ' documents!');
    });
    stream.on('error', function (err) {
        console.log(err);
    });
}

module.exports = Product;