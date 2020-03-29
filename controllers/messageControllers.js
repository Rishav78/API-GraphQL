//@ts-check
const services = require('../services');

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

    const asyncIterator = (items, cb, i=0) => {
        if(i<items.length){
            cb(items[i]);
            setTimeout(() => asyncIterator(items, cb, i+1), 5);
        }
    }

    return async function(data, cb) {
        try {
            const { chat, message } = data;
            console.log(chat.receiver);
            const msg = await services.message.save(chat._id, message, authdata._id);
            asyncIterator(chat.receiver, (item) => {
                const id = connected[item._id];
                if(!id) return;
                io.to(id).emit('new-message', { message: msg, chatid: chat._id });
            })
            return cb(msg);
        }
        catch (err) {
            
        }
    }
}