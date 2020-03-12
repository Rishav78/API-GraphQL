
const sendMessage = (i, data , authdata, connected, io) => {
    if( i < data.chat.chatmembers.length ) {
        const id = data.chat.chatmembers[i]._id;
        const socketid = connected[id];
        if(socketid && id !== authdata._id) {
            io.to(socketid).emit('new-message', { ...data.message, chat: { _id: data.chat._id }, receivedby: undefined });
        }
        setTimeout(() => sendMessage(i+1, data, authdata, io), 5);
    }
}

module.exports = {
    sendMessage
}