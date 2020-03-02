const mongoose = require('./db');

let userSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    imageid: {
        type: String
    },
    phone: {
        type: String,
    },
    password: {
        type: String
    },
    friends: [{    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    activeChats:  [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'chats',
    }],
    status: {
        type: Boolean,
    }
},{
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);