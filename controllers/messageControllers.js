//@ts-check
const services = require('../services');

exports.updateReceiveBy = (io, authdata, connected) => {
    return async function(data, cb) {
        const { messageId } = data;
        const { message, success } = await services.message.updateReceivedBy(messageId, authdata._id);
        const { sender } = message;
        const socketid = connected[sender._id];
        return io.to(socketid).emit('update-message-information', message);
    }
} 

exports.updateSeenBy = (io, authdata, connected) => {
    return async function(data, cb) {
        const { messageId } = data;
        const { message, success } = await services.message.updateSeenBy(messageId, authdata._id);
        const { sender } = message;
        const socketid = connected[sender._id];
        return io.to(socketid).emit('update-message-information', message);
    }
}

exports.save = (io, authdata, connected) => {
    return async function(data, cb) {
        const { chatId, message, receiver  } = data;
        const { msg, success, err } = await services.message.save(chatId, message, authdata._id);
        const send = (i) => {
            if( i !== receiver.length ) {
                const id = receiver[i]._id;
                const socketid = connected[id];
                if(socketid && id !== authdata._id) {
                    io.to(socketid).emit('new-message', { ...msg._doc, chatId, receivedby: undefined });
                }
                setTimeout(() => send(i+1), 5);
            }
        }
        setTimeout(() => send(0), 5);
        return cb(msg);
    }
}