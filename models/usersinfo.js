const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    'firstname': {
        'type': String,
        'required': true,
    },
    'lastname': {
        'type': String,
        'required': true,
    },
    'email': {
        'type': String,
        'required': true,
        'match': [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please provide a valid email'
        ],
    },
    'imageid': {
        'type': String,
        'default': 'default.png'
    },
    'friends': [{    
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'users',
        'default': []
    }],
    'activeChats':  [{
        'type': mongoose.Schema.Types.ObjectId, 
        'ref': 'chats',
        'default': []
    }],
    'status': {
        'type': Boolean,
        'required': true,
        'default': false,
    }
},{
    'timestamps': true
});

module.exports = mongoose.model('userinfos', userSchema);