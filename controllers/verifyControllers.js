const jwt = require('jsonwebtoken');
const services = require('../services');
const users = require('../models/users');
const { sendMail } = require('../config/nodemailer');

exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        const { success, message, exist } = await services.token.usedToken(id);
        if (!success) {
            throw new Error(message);
        }
        if (exist) {
            throw new Error('Token already used');
        }
        const decodedToken = jwt.verify(id, process.env.JSON_WEB_TOKEN_EMAIL_VERIFIY);
        const result = await services.verify.verifyUser(decodedToken._id);
        await services.token.insert(id);
        return res.json(result);
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

exports.getVerificationToken = async (req, res) => {
    const { email, _id } = req.body;
    try {
        const user = await users.findById(_id);
        const token = user.getLoginToken();
        sendMail(email, token)
        return res.json({ success: true });
    }
    catch (err) {
        return res.json({ success: false, err: err.message });
    }
}