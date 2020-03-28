const chat = require('../../models/chats');
const userInfo = require('../../models/usersinfo');
const { users, asyncIterator } = require('../helpers');

const findByUserId = async _id => {
    
    return cht; 
}

module.exports = {
    chats: async (args, req) => {
        const { isAuth } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const chats = await chat.find().populate('messages');
            return {
                chats: chats.map( singleChat => ({
                    ...singleChat._doc, chatmembers: users.bind(this, singleChat.chatmembers)
                }))
            };
        }
        catch (err) {
            return { err: err.message };
        }
    },
    chat: async (args, req) => {
        const select = { firstname: 1, lastname: 1, email: 1, imageid: 1 };
        const { isAuth } = req;
        const { _id  } = args;
        try {
            if(!isAuth) {
                throw new Error('not authenticated')
            }
            const cht = await chat.findById(_id).populate('messages').populate('chatmembers', select);
            return cht.map( singleChat => ({
                ...singleChat._doc, chatmembers: users.bind(this, singleChat.chatmembers)
            }));
        }
        catch (err) {
            throw err;
        }
    },
    CreatePersonalChat: async (args, req) => {
        const { userId, isAuth } = req;
        const { InputChat } = args;
        try {
            if(!isAuth) {
                throw new Error('not authenticated')
            }
            const chatmembers = [ InputChat.chatmember, userId];
            const chatExists = await chat.findOne({ 
                $and:[{ 
                    chatmembers: { 
                        $all: chatmembers
                    } 
                },
                {
                    chattype: 'personal' 
                }]
            });
            if(!!chatExists) {
                throw new Error('chat exists');
            }
            const newchat = (new chat({
                ...InputChat, chatmembers 
            })).save();
            await userInfo.updateMany({ _id: { $in: chatmembers } });
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