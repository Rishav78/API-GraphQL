
const authResolver = require('./auth');
const userResolver = require('./user');
const chatResolver = require('./chat');
const messageResolver = require('./message');

module.exports = {
    ...authResolver,
    ...chatResolver,
    ...messageResolver,
    ...userResolver,
};