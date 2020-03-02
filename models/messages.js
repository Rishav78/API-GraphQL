const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receivedby: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        seen: {
            type: Boolean,
            default: false,
        }
    }],
    message: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('messages', messageSchema);