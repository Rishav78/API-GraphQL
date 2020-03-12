const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userinfos',
        required: true
    },
    messagetype: {
        type: String,
        enum: ['text', 'audio', 'video', 'doc', 'image'],
        required: true,
        default: 'text'
    },
    receivedby: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'userinfos',
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