
exports.typing = (io, authdata, connected) => {
    return async function(data, cb) {
        const { chat, status } = data;
        const { chatmembers, _id: chatId } = chat;
        const send = function(i) {
            if ( i < chatmembers.length ) {
                const id = chatmembers[i]._id
                const socketid = connected[id];
                if( !!socketid && id !== authdata._id ) {
                    io.to(socketid).emit('user-typing', { chatId, sender: authdata._id, status });
                }
                setTimeout(() => send(i+1), 5);
            }
        }
        setTimeout(() => send(0), 5);
    }
}

exports.userStatus = (io, connected) => {
    return function(data, cb) {
        const { _id } = data;
        const status = typeof connected[_id] !== 'undefined';
        cb({ status });
    }
}