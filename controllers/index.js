const message = require('./messageControllers');
const verify = require('./verifyControllers');
const user = require('./userControllers');
const auth = require('./authControllers');

module.exports = {
    message,
    verify,
    user,
    auth
}