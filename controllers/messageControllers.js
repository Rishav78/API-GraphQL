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

exports.send = (io, authdata, connected, data) => {

    const asyncIterator = (items, cb, i=0) => {
        if(i<items.length){
            cb(items[i]);
            setTimeout(() => asyncIterator(items, cb, i+1), 5);
        }
    }

    return async function(info, cb) {
        try {
            const { chat, message } = info;
            console.log(info);
            asyncIterator(chat.receiver, (item) => {
                const id = connected[item];
                if(!id) {
                    if(!data[item]) {
                        data[item] = {};
                    }
                    if(!data[item].messages) {
                        data[item].messages = [];
                    }
                    return data[item].messages.push(info);
                }
                io.to(id).emit('new-message', { message, chat });
            });
            return cb({ err: null });
        }
        catch (err) {
            return cb({ err: err.message });
        }
    }
}