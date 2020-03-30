const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    'phone': {
        'type': String,
        'required': true,
        'unique': true,
    },
    'verified': {
        'type': Boolean,
        'required': true,
        'default': true
    },
    'active': {
        'type': Boolean,
        'required': true,
        'default': true,
    },
    'logedin': {
        'type': Boolean,
        'required': true,
        'default': false
    }
});

// userSchema.pre('save', async function(next) {
//     const { email } = this;
//     const exists = await this.model('users').findOne({ email });
//     if ( exists ) {
//         throw Error('user already exists');
//     }
//     next();
// });

userSchema.methods.getLoginToken = async function() {
    const { active, verified, phone, logedin, _id:id } = this;
    const { _id } = await this.model('userinfos').findOne({ email });
    if(logedin) {
        throw new Error(' already logedin in another device');
    }
    if (!active) {
        throw new Error('this user has been deleted');
    }
    if (!verified) {
        throw new Error('verify the account to login');
    }
    const token = jwt.sign({ phone, _id }, process.env.JSON_WEB_TOKEN_KEY, {
        // expiresIn: `${process.env.AUTH_TOKEN_EXPIRESIN}h`
    });
    this.model('users').findByIdAndUpdate(id, { $set: { logedin: true } });
    return { token, expiresIn: process.env.AUTH_TOKEN_EXPIRESIN, _id };
}

module.exports = mongoose.model('users', userSchema);