const users = require('../models/users');
const jwt = require('jsonwebtoken');

exports.login = (connected) => {
    return async function(socket, data, cb) {
        const { email, password, token } = data;
        try {
            if (!!token) {
                const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY);
                console.log(decodedToken)
                if(!decodedToken) {
                    throw new Error('invalid token');
                }
                if(!!connected[decodedToken._id]) {
                    throw new Error('already logedin in another device');
                }
                data._id = decodedToken._id;
                return cb(null, { token, _id: decodedToken._id });
            }
            else {
                const user = await users.findOne({ email });
                if (!user) {
                    throw new Error('user does not exist'); 
                }
                const newToken = await user.getLoginToken(email, password);
                data._id = newToken._id;
                return cb(null, { authenticate: true, token: newToken.token });
            }
        }
        catch (err) {
            console.log(err)
            return cb({ authenticate: false, message: err.message }, null);
        }
    }
}

exports.logout = (connected, connected2) => {
    return function (socket) {
        const userId = connected2[socket.id];
        delete connected2[socket.id];
        delete connected[userId];
        socket.broadcast.emit('user-status', { userId, status: false });
        console.log('disconnected')
    }
}