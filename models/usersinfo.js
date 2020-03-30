const mongoose = require('mongoose');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    'number': {
        'type': String,
        'required': true,
        'unique': true
    },
    'countrycode' : {
        'type': String,
        'required': true,
    },
    'name': {
        'type': String,
        'required': true
    },
    'status': {
        'type': String,
        'required': true,
        'default': "Hey There! I'm using LetsChat"
    },
})

// let userSchema = new mongoose.Schema({
//     'firstname': {
//         'type': String,
//         'required': true,
//     },
//     'lastname': {
//         'type': String,
//         'required': true,
//     },
//     'email': {
//         'type': String,
//         'required': true,
//         'match': [
//             /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//             'please provide a valid email'
//         ],
//         unique: true
//     },
//     'imageid': {
//         'type': String,
//         'required': true,
//         'default': 'default.png'
//     },
//     'friends': [{    
//         'type': mongoose.Schema.Types.ObjectId,
//         'ref': 'userinfos',
//         'default': []
//     }],
//     'activeChats':  [{
//         'type': mongoose.Schema.Types.ObjectId, 
//         'ref': 'chats',
//         'default': []
//     }],
//     'status': {
//         'type': String,
//         'required': true,
//         'default': "Hey There! I'm using LetsChat",
//     }
// },{
//     'timestamps': true
// });

// async function verification(next) {
//     const { email } = this;
//     const user = this.model('users').findOne({ email });
//     if (!user.active) {
//         throw new Error('user doest not exist');
//     }
//     if(!user.verified) {
//         throw new Error('verify your account before accessing it')
//     }
//     next();
// }

// userSchema.pre('findOne', verification);
// userSchema.pre('findOneAndUpdate', verification);

userSchema.pre('save', function(next) {
    this.name = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('userinfos', userSchema);