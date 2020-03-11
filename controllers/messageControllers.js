const services = require('../services');
const auth = require('../auth/is-auth');

exports.updateReceiveBy = (io, connected) => {
    return async function(data, cb) {
        const { userId, messageId } = data;
        const updatedMessage = await services.message.updateReceivedBy(messageId, userId);
        const { sender } = updatedMessage;
        const socketid = connected[sender._id];
        return io.to(socketid).emit('update-message-information', updatedMessage);
    }
} 

exports.updateSeenBy = (io, connected) => {
    return async function(data, cb) {
        const { userId, messageId } = data;
        const updatedMessage = await services.message.updateSeenBy(messageId, userId);
        const { sender } = updatedMessage;
        const socketid = connected[sender._id];
        io.to(socketid).emit('update-message-information', updatedMessage);
    }
}

exports.save = (io, connected) => {
    return async function(data, cb) {
        const { chatId, message, receiver, chatId  } = data;
        const msg = await services.message.save(chatId, message, userId);
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