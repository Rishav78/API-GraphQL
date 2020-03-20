const chat = require('../../models/chats');
const path = require('path');
const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const { users } = require('../helpers');
const { generateKeyPair } = require('../../lib/generateKeyPair');

module.exports = {
    chats: async (args, req) => {
        const { isAuth } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
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
            const { privateKey, publicKey } = await generateKeyPair();
            await writeFile(path.join(__dirname, '..', '..', 'keys', `chat-${newchat._id}-privatekey.pem`), privateKey);
            await writeFile(path.join(__dirname, '..', '..', 'keys', `chat-${newchat._id}-publicKey.pem`), publicKey);
            return {
                ...newchat._doc, 
                chatmembers: users.bind(this, newchat.chatmembers)
            };
        }
        catch (err) {
            throw err;
        }
    }
};  