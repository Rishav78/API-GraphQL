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
        const { isAuth } = req;
        const { _id } = args;
        try {
            if(!isAuth) {
                throw new Error('not authenticated')
            }
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
        const { userId, isAuth } = req;
        const { InputChat } = args;
        const { chatmembers } = InputChat;
        try {
            if(!isAuth) {
                throw new Error('not authenticated')
            }
            const newChat = new chat({...InputChat, chatmembers: [...chatmembers, userId]});
            const newchat = await newChat.save();
            return {
                ...newchat._doc, chatmembers: users.bind(this, newchat.chatmembers)
            };
        }
        catch (err) {
            throw err;
        }
    }
};  