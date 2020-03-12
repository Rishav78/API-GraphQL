const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    mediatype: {
        type: String,
        enum: ['text', 'audios', 'videos', 'documents', 'images'],
        required: true,
    },
    storedname: {
        type: String,
        required: true
    },
    extention: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('medias', mediaSchema);