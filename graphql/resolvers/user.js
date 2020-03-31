const { parsePhoneNumberFromString } = require('libphonenumber-js');
const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');

module.exports = {
    user: async ( args, req ) => { 
        const { isAuth } = req;
        try {
            // if (!isAuth) {
            //     throw new Error('unauthrized');
            // }
            const parser = parsePhoneNumberFromString(args.phone);
            const number = parser ? parser.nationalNumber : args.phone;
            const info = await userinfo.findOne({ number });
            if(!info) {
                throw new Error('user does not exist');
            }
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