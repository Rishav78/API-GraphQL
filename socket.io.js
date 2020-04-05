const socketIO = require('socket.io');
const { validToken } = require('./auth/is-auth');
const controllers = require('./controllers');

module.exports = server => {
    const io = socketIO(server, {
        transports: ['websocket', 'polling']
    });

    io.use(function (socket, next) {
        if (!socket.handshake.query || !socket.handshake.query.token) {
            console.log('err');
            return next(new Error('unauthenticated'));
        }
        const { authenticated, user } = validToken(socket.handshake.query.token);
        if (!authenticated) {
            console.log('err');
            return next(new Error('unauthenticated'));
        }
        socket.user = user;
        next();
    });

    const connected = {}, connected2 = {}, data = {};

    io.on('connection', function(socket) {

        const { countrycode, number } = socket.user.number;
        const key = `+${countrycode}${number}`;

        if(connected[key]) {
            socket.emit('unauthenticated', { err: 'already logedin'});
            console.log('already logedin')
            return socket.disconnect();
        }

        connected[key] = socket.id;
        connected2[socket.id] = key;

        if (data[key]) {
            console.log(data[key]);
        }

        socket.broadcast.emit('user-online', { id: key, status: true });

        console.log('connected', key, socket.id);

        socket.on('user-status', controllers.user.userStatus(io, connected));

        socket.on('delete-messages', controllers.message.deleteMessage(io, connected));

        // socket.on('typing', controllers.user.typing(io, authdata, connected, connected2));

        socket.on('create-new-group', controllers.chat.createGroup(io, connected));

        // socket.on('send-message-to-group', controllers.message.sendMessageToGroup(io, connected));

        socket.on('send-message', controllers.message.sendMessage(io, connected));

        // socket.on('message-delivered', controllers.message.updateReceiveBy(io, authdata, connected, connected2));

        // socket.on('message-seen', controllers.message.updateSeenBy(io, authdata, connected, connected2));

        // socket.on('send-file', controllers.file.sendFile(io, authdata, connected))

        socket.on('disconnect', controllers.auth.logout(connected, connected2, socket));

    });
}
