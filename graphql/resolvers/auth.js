const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');

module.exports = {
    login: async ( args ) => {
        const { email, password } = args;
        try{
            const user = await users.findOne({ email });
            if ( !user ) {
                throw Error('user doest not exists');
            }
            const token = await user.getLoginToken();
            return { _id, ...token };
        }
        catch (err) {
            throw err;
        }
    },
    createUser: async ( args, req ) => {
        const { email, password, ...restInfo } = args.InputUser;
        try {
            await (new users({ email, password })).save();
            const newUserInfo = new userinfo({ email, ...restInfo });
            return await newUserInfo.save();
        }
        catch (err) {
            throw err;
        }
    }
}