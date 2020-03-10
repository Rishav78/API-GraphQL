const users = require('../../models/users');
const userinfo = require('../../models/usersinfo');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../../config/nodemailer');

module.exports = {
    login: async ( args ) => {
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
            // await (new users({ email, password })).save();
            // const newUserInfo = new userinfo({ email, ...restInfo });
            // const user = await newUserInfo.save();
            const token = jwt.sign({ email }, process.env.JSON_WEB_TOKEN_EMAIL_VERIFIY, {
                expiresIn: '1d'
            });
            sendMail(email, token)
            .then(() => {
                console.log('domw');
            })
            // return user;
        }
        catch (err) {
            throw err;
        }
    }
}