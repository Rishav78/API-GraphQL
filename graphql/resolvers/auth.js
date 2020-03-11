const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');
const { sendMail } = require('../../config/nodemailer');

module.exports = {
    login: async ( args ) => {
        const { email, password } = args;
        try{
            const user = await users.findOne({ email });
            if ( !user ) {
                throw Error('user doest not exists');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if ( !isEqual ) {
                throw Error('invalid password');
            }
            return await user.getLoginToken();
        }
        catch (err) {
            throw err;
        }
    },
    CreateUser: async ( args, req ) => {
        const { email, password, ...restInfo } = args.InputUser;
        try {
            const { _id } = await (new users({ email, password })).save();
            const newUserInfo = new userinfo({ email, ...restInfo });
            const user = await newUserInfo.save();
            const token = jwt.sign({ email, _id  }, process.env.JSON_WEB_TOKEN_EMAIL_VERIFIY, {
                expiresIn: `${process.env.EMAIL_VERIFIY_TOKEN_EXPIREIN}h`
            });
            sendMail(email, token);
            return user;
        }
        catch (err) {
            throw err;
        }
    }
}