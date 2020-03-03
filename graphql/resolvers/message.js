const message = require('../../models/messages');

module.exports = {
    messages: async ( args, req ) => {
        const { isAuth } = req;
        try {
            const messages = await message.find();
            return messages;
        } 
        catch (err) {
            throw err;
        }
    },
    messageById: async ( args, req ) => {
        const { _id } = args;
        try {
            const msg = await message.findById(_id);
            return msg;
        }
        catch (err) {
            throw err;
        }
    },
    createMessage: async ( args, req ) => {
        const { InputMessage } = args;
        try {
            const msg = new message({...InputMessage});
            return (await msg.save());
        }
        catch (err) {
            throw err;
        }
    },
}