const jwt = require('jsonwebtoken');
const services = require('../services');

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