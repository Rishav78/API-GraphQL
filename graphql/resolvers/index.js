
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const message = require('../../models/messages');
const user = require('../../models/users');

// Friends Function
const users = async ids => {
    const usrs = await user.find({_id: { $in: ids }}, { password: 0 });
    return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
}

module.exports = {
    messages: async ( args, req ) => {
        const { isAuth } = req;
        try {
            if ( !isAuth ) {
                throw Error('unauthorized');
            }
            const messages = await message.find({});
            return messages;
        } 
        catch (err) {
            throw err;
        }
    },
    users: async ( args, req ) => {
        const { isAuth } = req;
        try {
            // if ( !isAuth ) {
            //     throw Error('unauthorized');
            // }
            const usrs = await user.find({}, { password: 0 });
            return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
        }
        catch (err) {
            console.log(err);
        }
    },
    userById: async ( args, req ) => {
        const { _id } = args;
        const usr = await user.findById(_id,  { password: 0 });
        return {...usr._doc, friends: users.bind(this, usr.friends)};
    },
    createUser: async ( args, req ) => {
        const { password:pswd, ...restInfo } = args.InputUser;
        try {
            const exists = await user.findOne({ phone: restInfo.phone });
            if ( exists ) {
                throw Error('user already exists');
            }
            console.log(pswd)
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
    },
    message: async ( args, req ) => {
        const { _id } = args;
        try {
            const msg = await message.findById(_id);
            return msg;
        }
        catch (err) {
            console.log(err);
        }
    },
    createMessage: async ( args, req ) => {
        const { InputMessage } = args;
        try {
            const msg = new message({...InputMessage});
            return (await msg.save());
        }
        catch (err) {
            console.log(err);
        }
    },
    Login: async ( args ) => {
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

    }
};