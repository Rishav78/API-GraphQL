const messages = require('../models/messages');

exports.updateMessage = async (_id, userid) => {
    try {
        const select = { firstname: 1, lastname: 1, imageid: 1 };
        let msg = await messages.findByIdAndUpdate(_id, { 
            '$push': {
                'receivedby': { 
                    user: userid 
                } 
            } 
        },{
            new: true, 
            useFindAndModify: false
        });
        msg = await msg.populate('receivedby.user', select)
                        .populate('sender', select)
                        .execPopulate();
        return { success: true, msg };
    } catch (err) {
        return { success:  false };
    }
}
