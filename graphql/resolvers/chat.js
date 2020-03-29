const chat = require('../../models/chats');
const userInfo = require('../../models/usersinfo');
const { users, asyncIterator } = require('../helpers');

const chatExist = async members => {
    return  await chat.findOne({ 
        $and:[{ 
            chatmembers: { 
                $all: members
            } 
        },
        {
            chattype: 'personal' 
        }]
    });
}

module.exports = {
    chats: async (args, req) => {
        const { isAuth, userId } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const chats = await userInfo.findById(userId, { activeChats: 1 })
                .populate('activeChats')
                .populate({
                    path: 'messages',
                    option: {
                        limit: 2,
                        sort: { created: -1 }
                    }
                });
            return {
                chats: chats.activeChats.map( singleChat => ({
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
            const cht = await chat.findById(_id).populate('messages');
            return { ...cht._doc, chatmembers: users.bind(this, cht.chatmembers)}
        }
        catch (err) {
            throw err;
        }
    },
    CreatePersonalChat: async (args, req) => {
        const select = { firstname: 1, lastname: 1, email: 1, imageid: 1 };
        const { userId, isAuth } = req;
        const { InputChat } = args;
        try {
            if(!isAuth) {
                throw new Error('not authenticated')
            }
            const chatmembers = [ InputChat.chatmember, userId];
            const exists = await chatExist(chatmembers);
            if(!!exists) {
                throw new Error('chat exists');
            }
            const newchat = (await (new chat({
                chatmembers, chattype: 'personal'
            })).save()).populate('chatmembers', select);
            await userInfo.updateMany({ _id: { $in: chatmembers } }, { $push: { activeChats: newchat._id } });
            return {
                ...newchat._doc, 
                chatmembers: users.bind(this, newchat.chatmembers)
            };
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
};  