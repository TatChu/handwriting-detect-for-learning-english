'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const _ = require('lodash');
// const auditLog = require('audit-log');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_LENGTH = 9;

var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

var validateLocalStrategyPassword = function (password) {
    return (this.provider !== 'local' || (password && password.length > 5));
};

var UserSchema = new Schema({
    old_id: {
        type: Number,
        default: null,
    },
    name: {
        type: String,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Please fill in your name']
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Please fill in your phone']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        default: null,
        sparse: true,
        // validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    avatar: {
        type: String,
        trim: true,
        default: 'avatar.png'
    },
    password: {
        type: String,
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    activeToken: {
        type: String,
        default: '',
        trim: true,
    },
    activeExpires: {
        type: Date
    },
    provider: {
        type: String,
        default: null,
    },
    provider_id: {
        type: String,
        default: null,
        trim: true,
        index: false,
        // unique: true,
        sparse: true,
    },
    providerData: {
    },
    vocative: {
        type: String,
        default: '',
        trim: true,
    },
    favorite_product: [
    {
        _id: false,
        type: Schema.ObjectId,
        ref: 'Product'
    }
    ],
    dob: {
        type: Date,
        default: null
    },
    additionalProvidersData: {},
    status: {
        type: Boolean,
        default: true
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    deletedAt: Date,

    customer: {
        shipping_address: [{
            _id: {
                type: Schema.Types.ObjectId,
                default: function () { return mongoose.Types.ObjectId() }
            },
            name: {
                type: String
            },
            phone: {
                type: String
            },
            address_detail: {
                type: String
            },
            id_shipping_fee: {
                type: Schema.ObjectId,
                ref: 'ShippingFee'
            },
            vocative: {
                type: String
            }
        }]
    }
}, {
    collection: prefixCollection + 'users',
    timestamps: true
});
/******************************************************************
Methods
*******************************************************************/
UserSchema.methods = {
    hashPassword: function (password, callback) {
        Bcrypt.hash(password, SALT_LENGTH, callback);
    },
    compare: function (password, callback) {
        /*So Sánh kiểu mã hóa cũ*/
        let saltArr = String (this.password).split(':');
        if(saltArr.length == 2){
            let salt = saltArr[1];
            let hashOld = saltArr[0];

            var hashedPassword = crypto.createHash('md5').update(salt + password).digest('hex');
            if(hashedPassword == hashOld){
                return callback(null, true);
            }
        }
        
        /*So Sánh kiểu mã hóa mới*/
        Bcrypt.compare(password, this.password, callback);
    }
};

let User = mongoose.model('User', UserSchema);

/*audilog user*/
// var pluginFn = auditLog.getPlugin('mongoose', { modelName: 'Users', namePath: 'name' }); // setup occurs here 
// UserSchema.plugin(pluginFn.handler); // .handler is the pluggable function for mongoose in this case 

module.exports = User;