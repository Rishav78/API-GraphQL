const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');
const { sendMail } = require('../../config/nodemailer');

module.exports = {
    login: async (args) => {
        const { phone } = args;
        try {
            const user = await users.findOne({ phone });
            if (user) {
                if(user.logedin) {
                    throw new Error('user already logedin in another device');
                }
                return;
            }
            (new users({ phone })).save();
        }
        catch (err) {
            return { err: err.message }
        }
    },
    // CreateUser: async (args, req) => {
    //     const { email, password, ...restInfo } = args.InputUser;
    //     try {
    //         const { _id } = await (new users({ email, password })).save();
    //         const newUserInfo = new userinfo({ email, ...restInfo });
    //         const user = await newUserInfo.save();
    //         const token = jwt.sign({ email, _id }, process.env.JSON_WEB_TOKEN_EMAIL_VERIFIY, {
    //             expiresIn: `${process.env.EMAIL_VERIFIY_TOKEN_EXPIREIN}h`
    //         });
    //         sendMail(email, token);
    //         return user;
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // },
    verifyUser: async (args, req) => {
        const { otp } = args;
        try {

        }
        catch (err) {
            throw err;
        }
    },
    currentUser: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('unauthorized')
            }
            const user = await userinfo.findOne({ phone: req.userId });
            if(!user) {
                throw new Error('unauthorized')
            }
            return { user };
        }
        catch (err) {
            return { err: err.message };
        }
    }
}