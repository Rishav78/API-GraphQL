const socketIO = require('socket.io');
const controllers = require('./controllers');
const users = require('./models/users');


module.exports = server => {
    const io = socketIO(server);

    connected = {};
    connected2 = {}

    require('socketio-auth')(io, {
        authenticate: function(socket, data, cb) {
            const { email, password } = data;
            const token = await users.getLoginToken(email, password);
            data._id = token._id;
            return cb(null, { authenticate: true });
        },
        postAuthenticate: function(socket, authdata) {

            connected[authdata._id] = socket.id;
            connected2[socket.id] = authdata._id;

            socket.on('user-status', (data, cb) => {
                const { _id } = data;
                const status = typeof connected[_id] !== 'undefined';
                cb({status: status});
            })
    
            socket.on('typing', (data) => {
                const { chat, status, user:sender } = data;
                const { receiver, _id } = chat;
                receiver.forEach( e => {
                    const socketid = connected[e._id];
                    io.to(socketid).emit('user-typing', { _id, sender, status });
                });
            });
    
            socket.on('message-delivered', async data => {
                const { success, msg } = await controllers.message.update(data);
                if(!success) return;
                
                const { sender } = msg;
                const { _id } = sender;
                const socketid = connected[_id];
                io.to(socketid).emit('update-message-information', { success, msg });
            })
    
            socket.on('send-message', async (data, cb) => {
                const {authenticated, ...message} = await controllers.messages.save(data);
                data.receiver.forEach( e => {
                    const socketid = connected[e._id];
                    if(socketid) io.to(socketid).emit('new-message', {...message})
                });
                cb({authenticated, ...message});
            });

        },
        disconnect: function(socket) {
            const _id = connected2[socket.id];
            delete connected2[socket.id];
            delete connected[_id];
            socket.broadcast.emit('user-status', { _id, status: false });
            console.log('user disconnected')
        },
        timeout: 1000
    });
}
