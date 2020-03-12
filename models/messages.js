const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userinfos',
        required: true
    },
    messagetype: {
        type: String,
        enum: ['text', 'media'],
        required: true,
        default: 'text'
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medias',
        required: function() {
            return this.messagetype !== 'text';
        }
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
        required: function() {
            return this.messagetype === 'text';
        }
    },
},{
    timestamps: true
});

module.exports = mongoose.model('messages', messageSchema);