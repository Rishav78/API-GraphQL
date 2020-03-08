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

chatSchema.pre('save', async function(next) {
    const { chattype } = this;
    if( chattype === 'group') {
        return next();
    }
    const { chatmembers } = this;
    const chat = await this.model('chats')
        .findOne({ 
            chatmembers: {
                $all: chatmembers
            },
            chattype: 'personal'
        });
    if (!!chat) {
        throw new Error('chat is already going on');
    }
    next();
});

chatSchema.pre('save', async function(next) {
    this.chatmembers.forEach( async member => {
        const { _id } = member;
        await this.model('userinfos').findByIdAndUpdate(_id, { $push: { activeChats: this._id } });
    });
    next();
});

module.exports = mongoose.model('chats', chatSchema);