const message = require('../../models/messages');
const userinfo = require('../../models/usersinfo');
const { users } = require('../helpers');

module.exports = {
    users: async ( args, req ) => {
        const { isAuth } = req;
        try {
            const Users = await userinfo.find({}, { password: 0 });
            return Users.map( user => ({ ...user._doc, friends: users.bind(this, user.friends )}));
        }
        catch (err) {
            throw err;
        }
    },
    userById: async ( args, req ) => {
        const { _id } = args;
        try {
            const usr = await user.findById(_id,  { password: 0 });
            return {...usr._doc, friends: users.bind(this, usr.friends)};
        }
        catch (err) {
            throw err;
        }
    },
}