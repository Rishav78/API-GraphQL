const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);
const messageController = require('./messageControllers');

const images = ['.jpg', '.png', '.gif', '.tif'];
const audios = ['.mp3', '.wav'];
const videos = ['.mp4'];
// const documents = ['.pdf', '.docx'];

function getPath(data) {
    const { chat } = data;
    const databasePath = path.join(__dirname, '..', 'database');
    const extention = path.extname(data.file.filename);
    const file = { filename: uuidv4() + extention };

    if (images.includes(extention)) { // check for image
        file.filepath = path.join(databasePath, 'images', chat._id);
        file.messagetype = 'image';
    }
    else if(audios.includes(extention)) { // check for audio
        file.filepath = path.join(databasePath, 'audios', chat._id);
        file.messagetype = 'audio';
    }
    else if(videos.includes(extention)) { // check for video
        file.filepath = path.join(databasePath, 'videos', chat._id);
        file.messagetype = 'video';
    }
    else { // check for document
        file.filepath = path.join(databasePath, 'documents', chat._id);
        file.messagetype = 'doc';
    }
    return file;
}

exports.sendFile = (io, authdata, connected) => {
    return async function(data, cb) {
        const { file } = data.file;
        const storage = getPath(data);
        try {
            if ( !(await exists(storage.filepath)) ) {
                await mkdir(storage.filepath)
            }
            await writeFile(path.join(storage.filepath, storage.filename), file, 'binary');
            await messageController.save(io, authdata, connected)({ 
                chat: data.chat, 
                message: { 
                    message: storage.filename, 
                    messagetype: storage.messagetype
                }
            }, cb);
            // const message = await services.message.save(data.chat._id, storage.filename, authdata._id, storage.messagetype);
            // setTimeout(() => helper.sendMessage(0, { chat: data.chat, message }, authdata, connected, io), 5);
        }
        catch (err) {
            cb({ success: false, err: err.message });
        }
    }
}
