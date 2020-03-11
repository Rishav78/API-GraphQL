const services = require('../services');
const auth = require('../auth/is-auth');

exports.updateReceiveBy = async (message, userid) => {
    const { _id } = message;
    const updatedMessage = await services.messages.updateReceivedBy(_id, userid);
    return updatedMessage;
}

exports.save = async (data, userId) => {
    const { chatId, message } = data;
    return await services.messages.save(chatId, message, userId);
}