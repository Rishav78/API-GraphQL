const chat = require('../../models/chats');
const { users } = require('../helpers');

module.exports = {
    chats: async (args, req) => {
        try {
            const chats = await chat.find().populate('messages');
            return chats.map( singleChat => ({
                ...singleChat._doc, chatmembers: users.bind(this, singleChat.chatmembers)
            }));
        }
        catch (err) {
            throw err;
        }
    },
    chatById: async (args, req) => {
        const { _id } = args;
        try {
            const chats = await chat.findById(_id).populate('messages');
            return chats.map( singleChat => ({
                ...singleChat._doc, chatmembers: users.bind(this, singleChat.chatmembers)
            }));
        }
        catch (err) {
            throw err;
        }
    },
    CreateChat: async (args, req) => {
        const { InputChat } = args;
        try {
            const newChat = new chat({ ...InputChat, messages: [] });
            const newchat = await newChat.save();
            const chats = await newchat.populate('messages');
            return {
                ...chats._doc, chatmembers: users.bind(this, chats.chatmembers)
            };
        }
        catch (err) {
            throw err;
        }
    }
};  