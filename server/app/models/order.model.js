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


const Counters = mongoose.model('Counters');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const OrderSchema = new Schema({
    old_id: {
        type: Number,
        default: null,
    },
    old_increment_id: {
        type: Number,
        default: null,
    },
    id_order: {
        type: Number,
        min: 0
    },
    id_shipping_fee: {
        type: Schema.ObjectId,
        ref: 'ShippingFee',
        // required: 'Shipping feild can not empty'
    },
    id_coupon: {
        type: Schema.ObjectId,
        ref: 'Coupon',
    },
    coupon: {
        code: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        value: {
            type: Number,
            default: 0,
        },
        // type: {
        //     type: String,
        //     enum: ['PC', 'MN'],
        // }
    },
    delivery_time: {
        type: String,
        enum: ['SANG', 'CHIEU'], //Sáng: 9:00-12:00 / Chiều: 13:00-17:00
        default: 'SANG'
    },
    type: {
        type: String,
        enum: ['BT', 'TL'], //Bình thường / Thanh lý
        default: 'BT'
    },
    delivery_type: {
        type: String,
        enum: ['CN', 'CT'], //Cá nhân / Tại công ty
        default: 'CN'
    },
    payment_info: {
        info: {
            _id: false,
            id_shipping_address: {
                type: Schema.ObjectId,
            },
            user_id: {
                type: Schema.ObjectId,
                ref: 'User',
            },
            full_name: {
                type: String
            },
            email: {
                type: String,
                trim: true,
                match: [/.+\@.+\..+/, 'Please fill a valid email address']
            },
            phone: {
                type: String,
                trim: true,
                required: 'Chưa có địa chỉ giao hàng'
            },
            district: {
                type: String,
            },
            shipping_fee: {
                type: Number,
                default: 0
            },
            address: {
                type: String,
                required: 'Payment info: address can not empty'
            },
            vocative: {
                type: String,
            }
        }
    },
    status: {
        type: String,
        enum: [
            'PROCCESS', 'FINISH', 'CANCEL' //Đang xử lý,Hoàn thành, Đã hủy
        ],
        default: 'PROCCESS'
    },
    total: {
        type: Number
    },
    order_detail: [
        {
            _id: false,
            product: {
                type: Schema.ObjectId,
                ref: 'Product',
                // required: 'Product can not empty'
            },
            order_quantity: {
                type: Number,
                required: 'Product order can not empty'
            },
            price: {
                type: Number,
            },
            total: {
                type: Number
            },
            id_promote: {
                id: {
                    type: Schema.ObjectId,
                    ref: 'Promotion',
                },
                name: {
                    type: String,
                },
                value: {
                    type: Number,
                },
                type: {
                    type: String,
                    enum: ['PC', 'MN'],
                }
            }
        }
    ],
    // payment_method
    payment_method: {
        type: String,
        enum: ['COD', 'CK'], // COD / Chuyển khoản
        default: 'COD' // default COD
    },
    note: {
        type: String
    },
    total_pay: {
        type: Number
    },
    shiper: {
        type: String,
        enum: ['SPT', 'AHM', 'GHN', 'MHV'], // - SPT, Ahamove (AHM), GiaoHangNhanh, MuaHangViet
        default: 'SPT' // default SPT
    },
    ship_date: {
        type: Date
    }
}, {
        collection: prefixCollection + 'order',
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    });

// Start: Virtual Populate
// Virtual Shipping Fee
OrderSchema.virtual('shipping_fee', {
    ref: 'ShippingFee',
    localField: 'id_shipping_fee',
    foreignField: '_id',
    justOne: true
});

// Virtual Coupon
OrderSchema.virtual('detail_coupon', {
    ref: 'Coupon',
    localField: 'id_coupon',
    foreignField: '_id',
    justOne: true
});

// Virtual Coupon
OrderSchema.virtual('products', {
    ref: 'Product',
    localField: 'order_detail.product',
    foreignField: '_id',
});

// Virtual Coupon
OrderSchema.virtual('order_detail.product_obj', {
    ref: 'Product',
    localField: 'order_detail.product',
    foreignField: '_id',
});

// Virtual Payment Info User
// OrderSchema.virtual('payment_info_user',{
//     ref: 'User',
//     localField: 'payment_info.info.user_id',
//     foreignField: '_id',
//     justOne: true
// });

// End: Virtual Populate

// List pre function
let preSave = function (next) {
    var order = this;
    // Check create or update
    if (!order.id_order) {
        // Create order id async
        let createOrderId = async(function () {
            // Check counters for order is created
            var counter = await(Counters.findOne({
                collection_name: 'order'
            }));
            if (!counter) {
                let count = 500000000;
                // Created counter documents
                let counter_create = new Counters({
                    collection_name: 'order',
                    sequence_value: count
                });
                counter_create.save().then(function (resp) {
                    console.log("Created counter for order");
                });
                return count;
            }
            else {
                // Update counter documents
                let count = counter.sequence_value + 1;
                let counter_update = _.extend(counter, { sequence_value: count });
                counter_update.save().then(function () {
                });
                return count;
            }
        });

        createOrderId().then(function (resp) {
            order.id_order = resp;
            next();
        })
    }
    else {
        next();
    }
}

OrderSchema.pre('save', preSave);

/*Create Elastic Search For Order Model*/
let defaultSetting = {
    defer: function () { return Bluebird.defer(); }
};
let settings = _.merge({}, defaultSetting, esConf.config);
let esClient = new elasticsearch.Client(settings);
OrderSchema.plugin(mongoosastic, { index: esConf.prefixIndex + '_orders', esClient: esClient });
let Order = mongoose.model('Order', OrderSchema);

if (sycnES) {
    /*Đồng bộ với colection đã tồn tại*/
    let stream = Order.synchronize({}, { saveOnSynchronize: true })
        , count = 0;

    stream.on('data', function (err, doc) {
        count++;
    });
    stream.on('close', function () {
        console.log('Order indexed ' + count + ' documents!');
    });
    stream.on('error', function (err) {
        console.log(err);
    });
}


module.exports = Order;