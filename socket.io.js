const socketIO = require('socket.io');
const controllers = require('./controllers');

module.exports = server => {
    const io = socketIO(server);

    const connected = {}, connected2 = {}, data={};

    require('socketio-auth')(io, {
        authenticate: controllers.auth.login(connected, connected2),

        postAuthenticate: function(socket, authdata) {
            const { countrycode, number } = authdata.number;
            const key = `+${countrycode}${number}`;
            connected[key] = socket.id;
            connected2[socket.id] = key;

            if(data[key]) {
                console.log(data[key]);
            }

            console.log('connected', key);

            // socket.on('user-status', controllers.user.userStatus(io, connected));
    
            socket.on('typing', controllers.user.typing(io, authdata, connected, connected2));
    
            socket.on('send-message', controllers.message.send(io, authdata, connected, data, connected2));

            socket.on('message-delivered', controllers.message.updateReceiveBy(io, authdata, connected, connected2));

            socket.on('message-seen', controllers.message.updateSeenBy(io, authdata, connected, connected2));

            socket.on('send-file', controllers.file.sendFile(io, authdata, connected))


        },

        disconnect: controllers.auth.logout(connected, connected2),

        timeout: 1000000
    });
}
