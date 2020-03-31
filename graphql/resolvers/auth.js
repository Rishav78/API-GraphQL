const users = require('../../models/users');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const userinfo = require('../../models/usersinfo');
const OTP = require('../../models/otp');

module.exports = {
    login: async (args) => {
        const { phone } = args;
        try {
            const { countryCallingCode: countrycode, // country code
                    nationalNumber, // number without country code
                    number } = parsePhoneNumberFromString(phone); // number with country code

            const user = await users.findOne({ number: nationalNumber });
            if(user) {
                if(user.logedin) {
                    throw new Error('user already logedin in another device');
                }
                await OTP.remove({ number });
            }
            else {
                await (new users({ 
                    number: nationalNumber,
                    countrycode
                })).save();
            }
            const code =  Math.floor(100000 + Math.random() * 900000).toString();
            // sendMessage(phone)
            await (new OTP({ number, otp: code })).save();
            return { success: true }
        }
        catch (err) {
            return { success: false, err: err.message }
        }
    },
    logout: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('unauthorized')
            }
            const { number } = req.userId;
            await users.updateOne({ number }, { logedin: false, verified:false });
            return { success: true };
        }
        catch (err) {
            return { success: false,  err: err.message };
        }
    },
    verifyUser: async (args, req) => {
        const { otp, phone } = args;
        try {
            console.log(args);
            const { number,
                    nationalNumber } = parsePhoneNumberFromString(phone);
                    
            const data = await OTP.findOne({ number })
            if(!data) {
                throw new Error('some error occured');
            }
            if(data.otp !== otp) {
                throw new Error('invalid OTP');
            }
            console.log(number);
            await OTP.findOneAndDelete({ number });
            const user = await users.findOneAndUpdate(
                { number: nationalNumber }, 
                { verified: true, active: true, 'logedin': true }, 
                { new: true }
            );
            const token = await user.getLoginToken();
            return { success: true, ...token };
        }
        catch (err) {
            return { success: false, err: err.message };
        }
    },
    currentUser: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('unauthorized')
            }
            const { number } = req.userId;
            const user = await userinfo.findOne({ number });
            if(!user) {
                throw new Error('user not found');
            }
            // console.log(user);
            return user;
        }
        catch (err) {
            return { err: err.message };
        }
    }
}