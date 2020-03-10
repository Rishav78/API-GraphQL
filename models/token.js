const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'token field is required'],
        unique: true
    },
});

module.exports = mongoose.model('tokens', TokenSchema);