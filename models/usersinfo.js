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

async function verification(next) {
    const { email } = this;
    const user = this.model('users').findOne({ email });
    if (!user.active) {
        throw new Error('user doest not exist');
    }
    if(!user.verified) {
        throw new Error('verify your account before accessing it')
    }
    next();
}

userSchema.pre('findOne', verification);
userSchema.pre('findOneAndUpdate', verification);

module.exports = mongoose.model('userinfos', userSchema);