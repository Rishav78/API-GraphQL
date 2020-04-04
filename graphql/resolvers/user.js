const { parsePhoneNumberFromString } = require('libphonenumber-js');
const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');

module.exports = {
    user: async ( args, req ) => { 
        const { isAuth, userId } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const parser = parsePhoneNumberFromString(args.phone);
            const number = parser ? parser.nationalNumber : args.phone;
            const user = await users.findOne({ number });
            if(!user) {
                throw new Error('user does not exist');
            }
            if(user.verified && user.number === userId.number) {
                throw new Error('some error occured');
            }
            const info = await userinfo.findOne({ number });
            return info;
        }
        catch (err) {
            return { err: err.message };
        }
    },
    insertUser: async (args, req) => {
        const { name, image } = args;
        try {
            if(!req.isAuth) {
                throw new Error('unauthorized')
            }
            const { number, countrycode } = req.userId;
            await (new userinfo({ name, number, countrycode })).save();
            return { success: true };
        }
        catch (err) {
            return { success: false, err: err.message };
        }
    },
    updateUser: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('unauthorized')
            }
            const { number, countrycode } = req.userId;
            await userinfo.updateOne({ number }, args);
            return { success: true };
        }
        catch (err) {
            return { success: false, err: err.message };
        }
    }
}