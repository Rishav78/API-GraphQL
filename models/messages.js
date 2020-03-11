const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receivedby: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            seen: {
                type: Boolean,
                default: false,
            }
        }],
        default: [],
        required: true
    },
    message: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('messages', messageSchema);