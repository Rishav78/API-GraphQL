
exports.typing = (io, connected) => {
    return async function(data, cb) {
        const { chat, status, user:sender } = data;
        const { receiver, _id: chatId } = chat;
        const send = function(i) {
            if ( i!== receiver.length ) {
                const id = receiver[i]._id
                const socketid = connected[id];
                if( !!socketid ) {
                    io.to(socketid).emit('user-typing', { chatId, sender, status });
                }
            }
            setTimeout(() => send(i+1), 5);
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