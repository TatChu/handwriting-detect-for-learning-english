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

const SearchSchema = new Schema({
    keyword:{
        type: String,
        required: 'Please fill keywork',
        unique: true
    },
    status:{
        type: Boolean,
        default: true
    },
    count:{
        type: Number,
        default: 0
    }
}, {
    collection: prefixCollection + 'search',
    timestamps: true,
});

/*Create Elastic Search For Product Model*/

let defaultSetting = {
	defer: function () {return Bluebird.defer();}
};
let settings = _.merge({}, defaultSetting, esConf.config);
let esClient = new elasticsearch.Client(settings);
SearchSchema.plugin(mongoosastic,{index: esConf.prefixIndex + '_searchs', esClient: esClient});

let Search = mongoose.model('Search', SearchSchema);

if(sycnES){
	/*Đồng bộ với colection đã tồn tại*/
	let stream = Product.synchronize({}, {saveOnSynchronize: true})
	, count = 0;

	stream.on('data', function(err, doc){
		count++;
	});
	stream.on('close', function(){
		console.log('Product indexed ' + count + ' documents!');
	});
	stream.on('error', function(err){
		console.log(err);
	});
}

module.exports = Search;