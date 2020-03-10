const jwt = require('jsonwebtoken');
const services = require('../services');

exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    const decodedToken = jwt.verify(id, process.env.JSON_WEB_TOKEN_EMAIL_VERIFIY);
    console.log(decodedToken);
    const result = await services.verify.verifyUser(decodedToken._id);
    return res.json(result);
}