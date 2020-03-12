//@ts-check
const services = require('../services');
const helper = require('./helperControllers');

exports.updateReceiveBy = (io, authdata, connected) => {
    return async function(data, cb) {
        try {
            const { messageId } = data;
            const { message, success } = await services.message.updateReceivedBy(messageId, authdata._id);
            const { sender } = message;
            const socketid = connected[sender._id];
            return io.to(socketid).emit('update-message-information', message);
        }
        catch (err) {
            
        }
    }
} 

exports.updateSeenBy = (io, authdata, connected) => {
    return async function(data, cb) {
        try {
            const { messageId } = data;
            const { message, success } = await services.message.updateSeenBy(messageId, authdata._id);
            const { sender } = message;
            const socketid = connected[sender._id];
            return io.to(socketid).emit('update-message-information', message);
        }
        catch (err) {

        }
    }
}

exports.save = (io, authdata, connected) => {
    return async function(data, cb) {
        try {
            const { chat, message } = data;
            const { msg, success, err } = await services.message.save(chat._id, message, authdata._id);
            setTimeout(() => helper.sendMessage(0, { chat, message: {...msg._doc} }, authdata, connected, io), 5);
            return cb(msg);
        }
        catch (err) {
            
        }
    }
}