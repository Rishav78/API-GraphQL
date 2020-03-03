const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../../models/users');

module.exports = {
    login: async ( args ) => {
        const { phone, password } = args;
        const usr = await user.findOne({ phone });
        try{
            if ( !usr ) {
                throw Error('user doest not exists');
            }
            const isEqual = await bcrypt.compare(password, usr.password);
            if ( !isEqual ) {
                throw Error('invalid password');
            }
            const { phone, _id } = usr;
            const token = jwt.sign({ phone, _id }, process.env.JSON_WEB_TOKEN_KEY, {
                expiresIn: '1h'
            });
            return { _id, token, expiresIn: 1 };
        }
        catch (err) {
            throw err;
        }
    },
    createUser: async ( args, req ) => {
        const { password:pswd, ...restInfo } = args.InputUser;
        try {
            const exists = await user.findOne({ phone: restInfo.phone });
            if ( exists ) {
                throw Error('user already exists');
            }
            const password = await bcrypt.hash(pswd, 12);
            const newUser = new user({
                ...restInfo, 
                password,
                activeChats: [],
                friends: [],
                status: false
            });
            const usr = await newUser.save();
            return usr;
        }
        catch (err) {
            throw err;
        }
    }
}