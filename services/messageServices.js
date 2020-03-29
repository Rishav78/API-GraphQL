const messages = require('../models/messages');
const chats = require('../models/chats');

exports.updateReceivedBy = async (messageId, userid) => {
    const select = { firstname: 1, lastname: 1, imageid: 1 };
    try {
        const updatedMessage = await messages.findByIdAndUpdate(messageId, 
        { 
            '$push': {
                'receivedby': { 
                    user: userid 
                } 
            } 
        },
        {
            new: true
        });
        const message = await updatedMessage.populate('receivedby.user', select)
                        .populate('sender', select)
                        .execPopulate();

        return { success: true, message };
    } 
    catch (err) {
        return { success:  false, err: err.message };
    }
}

exports.updateSeenBy = async (messageId, userId) => {
    const select = { firstname: 1, lastname: 1, imageid: 1 };
    try {
        const updatedMessage = await messages.findOneAndUpdate({ '_id': messageId, 'receivedby': { $elemMatch: { user: userId } }}, 
        { 
            '$set': {
                'receivedby.$.seen': true
            } 
        },
        {
            new: true
        });
        const message = await updatedMessage.populate('receivedby.user', select)
                        .populate('sender', select)
                        .execPopulate();
        return { success: true, message };
    } 
    catch (err) {
        return { success:  false, err: err.message };
    }
}

exports.save = async (chatId, msg, sender) => {
    const select = { firstname: 1, lastname: 1, imageid: 1 };
    const { message, messagetype, file } = msg;
    try {
        const newmessage = new messages({ sender, message, file, messagetype });
        const msg = await (await newmessage.save())
            .populate({ path: 'sender', select })
            .execPopulate();

        await chats.findByIdAndUpdate(chatId, { '$push': { 'messages': msg._id } });
        return  msg;
    } 
    catch (err) {
        throw err;
    }
}
