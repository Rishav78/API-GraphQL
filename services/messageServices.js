const messages = require('../models/messages');

exports.updateReceivedBy = async (messageId, userid) => {
    try {
        const select = { firstname: 1, lastname: 1, imageid: 1 };
        const updatedMessage = await messages.findByIdAndUpdate(messageId, 
        { 
            '$push': {
                'receivedby': { 
                    user: userid 
                } 
            } 
        },
        {
            new: true, 
            useFindAndModify: false
        });
        const msg = await updatedMessage.populate('receivedby.user', select)
                        .populate('sender', select)
                        .execPopulate();

        return { success: true, msg };
    } catch (err) {
        return { success:  false };
    }
}

exports.save = async (chatId, message, sender) => {
    const select = { firstname: 1, lastname: 1, imageid: 1 };
    try {
        const newmessage = new messages({ sender, message });

        const msg = (await newmessage.save())
            .populate({ path: 'sender', select })
            .execPopulate();

        await chats.findByIdAndUpdate(chatId, { '$push': { 'messages': msg._id } });
        return { success: true, msg };
    } 
    catch (err) {
        return { success: false };
    }
}
