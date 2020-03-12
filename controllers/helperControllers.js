
const sendMessage = (i, data , authdata, connected, io) => {
    if( i < data.chat.chatmembers.length ) {
        const id = data.chat.chatmembers[i]._id;
        console.log(id, i);
        const socketid = connected[id];
        if(socketid && id !== authdata._id) {
            io.to(socketid).emit('new-message', { ...data.message, chat: { _id: data.chat._id }, receivedby: undefined });
        }
        setTimeout(() => sendMessage(i+1, data, authdata, connected, io), 5);
    }
}

module.exports = {
    sendMessage
}