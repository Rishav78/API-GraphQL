const services = require('../services');
const auth = require('../auth/is-auth');

exports.updateReceiveBy = async (msg, userid) => {
    const { msg } = data;
    const { _id } = msg;
    const updatedMessage = await services.messages.updateReceivedBy(_id, userid);
    return updatedMessage;
}

exports.save = async (data, userId) => {
    const { chatId, message } = data;
    return await services.messages.save(chatId, message, userId);
}