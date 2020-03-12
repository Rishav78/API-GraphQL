const message = require('./messageControllers');
const verify = require('./verifyControllers');
const user = require('./userControllers');
const auth = require('./authControllers');
const file = require('./fileControllers');

module.exports = {
    message,
    verify,
    user,
    auth,
    file
}