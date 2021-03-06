const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    'number': {
        'type': String,
        'required': true,
        'unique': true,
        'match': [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            'invalid phone no'
        ]
    },
    'countrycode': {
        'type': String,
        'required': true
    },
    'verified': {
        'type': Boolean,
        'required': true,
        'default': false
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
    const { active, verified, number, countrycode, _id } = this;
    if (!active) {
        throw new Error('this user has been deleted');
    }
    if (!verified) {
        throw new Error('verify the account to login');
    }
    const token = jwt.sign({ 
        number : {
            number, countrycode
        }, _id }, process.env.JSON_WEB_TOKEN_KEY, {
        // expiresIn: `${process.env.AUTH_TOKEN_EXPIRESIN}h`
    });
    return { token, expiresIn: process.env.AUTH_TOKEN_EXPIRESIN, _id };
}

module.exports = mongoose.model('users', userSchema);