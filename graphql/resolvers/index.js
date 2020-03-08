
const authResolver = require('./auth');
const userResolver = require('./user');
const chatResolver = require('./chat');
const messageResolver = require('./message');
const friendResolver = require('./friend');

module.exports = {
    ...authResolver,
    ...chatResolver,
    ...messageResolver,
    ...userResolver,
    ...friendResolver
};