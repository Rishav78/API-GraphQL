const message = require('../../models/messages');

module.exports = {
    messages: async ( args, req ) => {
        const { isAuth } = req;
        const select = { firstname: 1, lastname: 1, imageid: 1 };
        try {
            // if (!isAuth) {
            //     throw new Error('unauthrized');
            // }
            const messages = await message.find()
                .populate('file')
                .populate('sender', select)
                .populate('receivedby', select);
                
            return messages;
        } 
        catch (err) {
            throw err;
        }
    },
    messageById: async ( args, req ) => {
        const { isAuth } = req;
        const { _id } = args;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const msg = await message.findById(_id);
            return msg;
        }
        catch (err) {
            throw err;
        }
    },
    CreateMessage: async ( args, req ) => {
        const { isAuth } = req;
        const { InputMessage } = args;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const msg = new message({...InputMessage});
            return (await msg.save());
        }
        catch (err) {
            throw err;
        }
    },
}