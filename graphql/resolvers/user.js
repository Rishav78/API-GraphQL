const message = require('../../models/messages');
const user = require('../../models/users');
const userinfo = require('../../models/usersinfo');
const { users } = require('../helpers');

module.exports = {
    users: async ( args, req ) => {
        const select = { firstname: 1, lastname: 1, email: 1, imageid: 1 };
        const { isAuth } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const {friends} = await userinfo.findById(req.userId, { friends: 1 });

            const Users = await userinfo.find({ $and: [{_id: { $nin: friends }}, {_id: { $ne: req.userId }}]}, select)
            return {
                users: Users.map( user => ({ ...user._doc, friends: users.bind(this, user.friends )}))
            };
        }
        catch (err) {
            return { err: err.message };
        }
    },
    user: async ( args, req ) => {
        const { isAuth } = req;
        const { _id } = args;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const usr = await userinfo.findById(_id,  { firstname: 1, lastname: 1, email: 1, imageid: 1 });
            return usr;
        }
        catch (err) {
            throw err;
        }
    },
}