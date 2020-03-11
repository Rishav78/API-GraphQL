const socketIO = require('socket.io');
const controllers = require('./controllers');
const users = require('./models/users');
const jwt = require('jsonwebtoken');

module.exports = server => {
    const io = socketIO(server);

    const connected = {}, connected2 = {};

    require('socketio-auth')(io, {
        authenticate: controllers.auth.login(connected, connected2),

        postAuthenticate: function(socket, authdata) {
            console.log('connected');
            connected[authdata._id] = socket.id;
            connected2[socket.id] = authdata._id;

            socket.on('user-status', controllers.user.userStatus(io, connected));
    
            socket.on('typing', controllers.user.typing(io, connected));
    
            socket.on('message-delivered', controllers.message.updateReceiveBy(io, connected, connected2));

            socket.on('message-seen', controllers.message.updateSeenBy(io, connected, connected2));
    
            socket.on('send-message', controllers.message.save(io, authdata, connected, connected2));

        },

        disconnect: controllers.auth.logout(connected, connected2),

        timeout: 10000
    });
}
