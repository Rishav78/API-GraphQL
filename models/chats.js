const mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
    chattype: {
        type: String,
        required: true,
        enum: ['group', 'personal']
    },
    chatname: {
        type: String,
        required: function() {
            const { chattype } = this;
            return chattype === 'group';
        }
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