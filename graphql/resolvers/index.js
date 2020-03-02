
const bcrypt = require('bcryptjs');

//Models
const message = require('../../models/messages');
const user = require('../../models/users');

// Friends Function
const users = async ids => {
    const usrs = await user.find({_id: { $in: ids }}, { password: 0 });
    return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
}

module.exports = {
    messages: async _ => {
        try {
            const messages = await message.find({});
            return messages;
        } 
        catch (err) {
            console.log(err.message);
        }
    },
    users: async _ => {
        try {
            const usrs = await user.find({}, { password: 0 });
            return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
        }
        catch (err) {
            console.log(err);
        }
    },
    userById: async args => {
        const { _id } = args;
        const usr = await user.findById(_id,  { password: 0 });
        return {...usr._doc, friends: users.bind(this, usr.friends)};
    },
    createUser: async args => {
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
    },
    message: async args => {
        const { _id } = args;
        try {
            const msg = await message.findById(_id);
            return msg;
        }
        catch (err) {
            console.log(err);
        }
    },
    createMessage: async (args) => {
        const { InputMessage } = args;
        try {
            const msg = new message({...InputMessage});
            return (await msg.save());
        }
        catch (err) {
            console.log(err);
        }
    }
}