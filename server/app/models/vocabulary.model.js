'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var VocabularySchema = new Schema({
    unit: {
        type: Schema.ObjectId,
        ref: 'Unit',
        require: true
    },
    word: {
        type: String,
        trim: true,
        require: true
    },
    define: {
        type: String,
        trim: true,
        require: true
    },
    lang: {
        type: String,
        enum: ['en', 'vi'],
        default: 'en'
    },
    audio_url: {
        type: String,
        trim: true,
    },
    transcribe: { // phiên âm
        type: String,
        trim: true,
    },
    images: [{
        _id: false,
        url: {
            type: String
        }
    }],
    status: {
        type: Boolean,
        default: true
    },
    // Loại từ: danh | động | tính | trạng | đại từ | giới từ | từ kết nối | từ hạn định | từ cảm thán
    // default: danh từ
    classes: {
        type: String,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'conjunction', 'determiner', 'exclamation'],
        default: 'noun'
    }
}, {
        collection: prefixCollection + 'vocabulary',
        timestamps: true
    });

module.exports = mongoose.model('Vocabulary', VocabularySchema);
