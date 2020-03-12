const services = require('../services');
const messageController = require('./messageControllers');



exports.sendFile = (io, authdata, connected) => {
    return async function(data, cb) {
        try {
            const media = await services.file.save(data);
            await messageController.save(io, authdata, connected)({ 
                chat: data.chat, 
                message: {
                    messagetype: 'media',
                    file: media
                }
            }, cb);
        }
        catch (err) {
            cb({ success: false, err: err.message });
        }
    }
}
