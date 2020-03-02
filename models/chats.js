const mongoose = require('./db');

let chatSchema = new mongoose.Schema({
    chattype: {
        type: Boolean,
    },
    chatname: {
        type: String,
    },
    chatmembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
    }],
    imageid: {
        type: String,
    }
},{
    timestamps: true
});

module.exports = mongoose.model('chats', chatSchema);