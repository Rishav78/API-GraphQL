const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

const images = ['.jpg', '.png', '.gif', '.tif'];
const audios = ['.mp3', '.wav'];
const videos = ['.mp4'];
// const documents = ['.pdf', '.docx'];

function getPath(authdata, data) {
    const databasePath = path.join(__dirname, '..', 'database');
    const extention = path.extname(data.file.filename);
    const file = { filename: uuidv4() + extention };

    if (images.includes(extention)) { // check for image
        file.filepath = path.join(databasePath, 'images', authdata.userId);
    }
    else if(audios.includes(extention)) { // check for audio
        file.filepath = path.join(databasePath, 'audios', authdata.userId);
    }
    else if(videos.includes(extention)) { // check for video
        file.filepath = path.join(databasePath, 'videos', authdata.userId);
    }
    else { // check for document
        file.filepath = path.join(databasePath, 'documents', authdata.userId);
    }
    return file;
}

exports.sendFile = (io, authdata, connected) => {
    return async function(data, cb) {
        const { file } = data.file;
        const storage = getPath(authdata, data);
        try {
            if ( !(await exists(storage.filepath)) ) {
                await mkdir(storage.filepath)
            }
            await writeFile(path.join(storage.filepath, storage.filename), file, 'binary');
            cb({ success: true, name: storage.filename });
        }
        catch (err) {
            cb({ success: false, err: err.message });
        }
    }
}
