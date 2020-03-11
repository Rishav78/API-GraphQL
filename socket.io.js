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
                    if(!!connected[decodedToken._id]) {
                        throw new Error('first logout from another device');
                    }
                    data._id = decodedToken._id;
                    return cb(null, { authenticate: true, token, _id: decodedToken._id });
                }
                catch (err) {
                    console.log(err.message)
                    return cb({ authenticate: false, message: err.message }, null);
                }
            }
            const user = await users.findOne({ email });
            console.log(user)
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
                const { msg } = await controllers.message.updateReceiveBy(data);                
                const { sender } = msg;
                const socketid = connected[sender._id];
                io.to(socketid).emit('update-message-information', msg);
            });

            socket.on('message-seen', async data => {
                const { msg } = await controllers.message.updateSeenBy(data);
                const { sender } = msg;
                const socketid = connected[sender._id];
                io.to(socketid).emit('update-message-information', msg);
            });
    
            socket.on('send-message', async (data, cb) => {
                const {msg} = await controllers.message.save(data, authdata._id);
                const { receiver, chatId } = data;
                const send = (i) => {
                    if( i !== receiver.length ) {
                        const id = receiver[i]._id;
                        const socketid = connected[id];
                        if(socketid && id !== authdata._id) {
                            io.to(socketid).emit('new-message', { ...msg._doc, chatId, receivedby: undefined });
                        }
                        setTimeout(() => send(i+1), 5);
                    }
                }
                setTimeout(() => send(0), 5);
                return cb(msg);
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
