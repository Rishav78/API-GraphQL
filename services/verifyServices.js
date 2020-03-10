const users = require('../models/users');

exports.verifyUser = async _id => {
    try {
        await users.findByIdAndUpdate(_id, { $set: { verified: true } });
        return { success: true };
    }
    catch (err) {
        return { success: false, msg: err.message };
    }
}