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
            const { email, password, token } = data;
            if (token) {
                try {
                    const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY);
                    if(!decodedToken) {
                        throw new Error('invalid token');
                    }
                    data._id = decodedToken._id;
                    return cb(null, { authenticate: true, token });
                }
                catch (err) {
                    console.log(err.message)
                    return cb({ authenticate: false, message: err.message }, null);
                }
            }
            const user = await users.findOne({ email });
            if (!user) {
                return cb({ authenticate: false, message: 'user does not exist' }, null); 
            }
            const newToken = await user.getLoginToken(email, password);
            data._id = newToken._id;
            return cb(null, { authenticate: true, token: newToken.token });
        },
        postAuthenticate: function(socket, authdata) {
            console.log('connected');
            connected[authdata._id] = socket.id;
            connected2[socket.id] = authdata._id;

            socket.on('user-status', (data, cb) => {
                const { _id } = data;
                const status = typeof connected[_id] !== 'undefined';
                cb({status: status});
            });
    
            socket.on('typing', (data) => {
                const { chat, status, user:sender } = data;
                const { receiver, _id } = chat;
                receiver.forEach( e => {
                    const socketid = connected[e._id];
                    io.to(socketid).emit('user-typing', { _id, sender, status });
                });
            });
    
            socket.on('message-delivered', async data => {
                const { success, msg } = await controllers.message.updateReceiveBy(data, authdata._id);
                if(!success) return ;
                
                const { sender } = msg;
                const socketid = connected[sender._id];
                io.to(socketid).emit('update-message-information', { success, msg });
            });
    
            socket.on('send-message', async (data, cb) => {
                const message = await controllers.messages.save(data);
                const { receiver, chatId } = data;
                const send = (i) => {
                    if( i !== receiver.length ) {
                        const socketid = connected[e._id];
                        if(socketid) io.to(socketid).emit('new-message', { ...message, chatId})
                        setTimeout(() => sendMessage(i+1), 5);
                    }
                }
                setTimeout(() => send(0), 5);
                return cb(message);
            });

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
