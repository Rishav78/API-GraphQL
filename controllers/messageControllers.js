const services = require('../services');
const auth = require('../auth/is-auth');

exports.updateReceiveBy = async (data) => {
    const { userId, messageId } = data;
    const updatedMessage = await services.message.updateReceivedBy(messageId, userid);
    return updatedMessage;
}

exports.updateSeenBy = async (data) => {
    const { userId, messageId } = data;
    const updatedMessage = await services.message.updateSeenBy(messageId, userId);
    return updatedMessage;
}

exports.save = async (data, userId) => {
    const { chatId, message } = data;
    return await services.message.save(chatId, message, userId);
}