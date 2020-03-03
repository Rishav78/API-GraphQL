const message = require('../../models/messages');
const user = require('../../models/users');
const { users } = require('../helpers');

module.exports = {
    users: async ( args, req ) => {
        const { isAuth } = req;
        try {
            const usrs = await user.find({}, { password: 0 });
            return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
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