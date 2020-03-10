const Token = require('../models/token');

exports.usedToken = async token => {
    try {
        const exist = await Token.findOne({ token });
        return { success: true, exist: !!exist };
    }
    catch (err) {
        return { success: false, message: err.message };
    }
}

exports.insert = async token => {
    try {
        await (new Token({ token })).save();
        return { success: true }
    }
    catch (err) {
        return { success: false, message: RegExp.message };
    }
}