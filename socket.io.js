const socketIO = require('socket.io');
const controllers = require('./controllers');
const users = require('./models/users');
const jwt = require('jsonwebtoken');

module.exports = server => {
    const io = socketIO(server);

    connected = {};
    connected2 = {}

    require('socketio-auth')(io, {
        authenticate: async function(socket, data, cb) {
            
        },
        postAuthenticate: function(socket, authdata) {
            console.log('connected');
            connected[authdata._id] = socket.id;
            connected2[socket.id] = authdata._id;

            socket.on('user-status', controllers.user.userStatus(io, connected));
    
            socket.on('typing', controllers.user.typing(io, connected));
    
            socket.on('message-delivered', controllers.message.updateReceiveBy(io, connected, connected2));

            socket.on('message-seen', controllers.message.updateSeenBy(io, connected, connected2));
    
            socket.on('send-message', controllers.message.save(io, connected, connected2));

        },
        disconnect: function(socket) {
            const userId = connected2[socket.id];
            delete connected2[socket.id];
            delete connected[userId];
            socket.broadcast.emit('user-status', { userId, status: false });
            console.log('disconnected')
        },
        timeout: 10000
    });
}
