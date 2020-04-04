
exports.logout = (connected, connected2, socket) => {
    return function () {
        const userId = connected2[socket.id];
        if(!userId) {
            console.log('user not loged in ', socket);
            return;
        }
        socket.broadcast.emit('user-status', { id: userId, status: false });
        delete connected2[socket.id];
        delete connected[userId];
        socket.broadcast.emit('user-status', { userId, status: false });
        console.log('disconnected ', socket.id)
    }
}