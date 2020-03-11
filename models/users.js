const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    'email': {
        'type': String,
        'required': true,
        'match': [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please provide a valid email'
        ],
        unique: true,
    },
    'password': {
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
    }
});

userSchema.pre('save', async function(next) {
    const { email } = this;
    const exists = await this.model('users').findOne({ email });
    if ( exists ) {
        throw Error('user already exists');
    }
    next();
});

userSchema.pre('save', async function(next) {
    const { password } = this;
    const passwordRegx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$_-]{8,}/;
    if (!passwordRegx.test(password)) {
        throw new Error('password must be of min 8 length and should contain special character(!@#$_)')
    }
    this.password = await bcrypt.hash(password, 12);
    next();
});

userSchema.methods.getLoginToken = async function() {
    const { active, verified } = this;
    const { _id } = await this.model('userinfos').findOne({ email });
    if (!active) {
        throw new Error('this user has been deleted');
    }
    if (!verified) {
        throw new Error('verify the account to login');
    }
    const token = jwt.sign({ email, _id }, process.env.JSON_WEB_TOKEN_KEY, {
        expiresIn: `${process.env.AUTH_TOKEN_EXPIRESIN}h`
    });
    return { token, expiresIn: process.env.AUTH_TOKEN_EXPIRESIN, _id };
}

module.exports = mongoose.model('users', userSchema);