const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');

module.exports = {
    login: async ( args ) => {
        console.log(args)
        const { email, password } = args;
        try{
            const user = await users.findOne({ email });
            if ( !user ) {
                throw Error('user doest not exists');
            }
            return await user.getLoginToken(email, password);
        }
        catch (err) {
            throw err;
        }
    },
    CreateUser: async ( args, req ) => {
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