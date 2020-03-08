const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    'email': {
        'type': String,
        'required': true,
        'match': [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please provide a valid email'
        ],
    },
    'password': {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);