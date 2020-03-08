const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../../models/users');

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
        try {
            const newUser = new user(args.InputUser);
            return await newUser.save();
        }
        catch (err) {
            throw err;
        }
    }
}