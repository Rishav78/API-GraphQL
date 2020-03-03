const chat = require('../../models/chats');

module.exports = {
    chats: async (args, req) => {
        const chats = await chat.find();
        return chats;
    },
    chatById: async (args, req) => {
        const { _id } = args;
        const chats = await chat.findById(_id);
        return chats;
    },
    createChat: async (args, req) => {
        const { InputChat } = args;
        try {
            const newChat = new chat({ ...InputChat, messages: [] });
            const newchat = await newChat.save();
            return (await newchat.populate('chatmembers').populate('messages'));
        }
        catch (err) {
            throw err;
        }
    }
};  