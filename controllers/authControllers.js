const users = require('../models/users');
const jwt = require('jsonwebtoken');

exports.login = (connected) => {
    return async function (socket, data, cb) {
        const { token } = data;
        try {
            if(!token) {
                throw new Error('unauthenticated');
            }
            const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY);
            const { number, countrycode } = decodedToken.number;
            const key = `+${countrycode}${number}`;
            if (!decodedToken) {
                throw new Error('invalid token');
            }
            if (!!connected[key]) {
                throw new Error('already logedin in another device');
            }
            data.number = { number, countrycode };
            return cb(null, { token, _id: decodedToken._id });
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
        if(!userId) {
            console.log('user not loged in ', socket.id);
            return;
        }
        delete connected2[socket.id];
        delete connected[userId];
        socket.broadcast.emit('user-status', { userId, status: false });
        console.log('disconnected ', socket.id)
    }
}