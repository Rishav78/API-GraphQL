const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');
const OTP = require('../../models/otp');

module.exports = {
    login: async (args) => {
        const { phone } = args;
        try {
            const user = await users.findOne({ phone });
            if(user) {
                if(user.logedin) {
                    throw new Error('user already logedin in another device');
                }
                await OTP.deleteOne({ phone });
            }
            else {
                await (new users({ phone })).save();
            }
            const code =  Math.floor(100000 + Math.random() * 900000).toString();
            // sendMessage(phone)
            await (new OTP({ phone, otp: code })).save();
            return { success: true }
        }
        catch (err) {
            return { success: false, err: err.message }
        }
    },
    verifyUser: async (args, req) => {
        const { otp, phone } = args;
        try {
            const data = await OTP.findOne({ phone })
            if(!data) {
                throw new Error('some error occured');
            }
            if(data.otp !== otp) {
                throw new Error('invalid OTP');
            }
            OTP.deleteOne({ phone });
            const user = await users.findOneAndUpdate({ phone }, { verified: true, active: true, 'logedin': true }, { new: true });
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
            const user = await userinfo.findOne({ phone: req.userId });
            if(!user) {
                throw new Error('user not found');
            }
            return { user };
        }
        catch (err) {
            return { err: err.message };
        }
    }
}