const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);
const media = require('../models/media');

const images = ['.jpg', '.png', '.gif', '.tif'];
const audios = ['.mp3', '.wav'];
const videos = ['.mp4'];
// const documents = ['.pdf', '.docx'];

function getStorageInfo(data) {
    const { chat } = data;
    const databasePath = path.join(__dirname, '..', 'database');
    const extention = path.extname(data.file.filename);
    const file = { filename: uuidv4(), extention };

    if (images.includes(extention)) { // check for image
        file.filepath = path.join(databasePath, 'images', chat._id);
        file.mediatype = 'images';
    }
    else if(audios.includes(extention)) { // check for audio
        file.filepath = path.join(databasePath, 'audios', chat._id);
        file.mediatype = 'audios';
    }
    else if(videos.includes(extention)) { // check for video
        file.filepath = path.join(databasePath, 'videos', chat._id);
        file.mediatype = 'videos';
    }
    else { // check for document
        file.filepath = path.join(databasePath, 'documents', chat._id);
        file.mediatype = 'documents';
    }
    return file;
}

exports.save = async ( data ) => {
    const { file } = data;
    const storage = getStorageInfo(data);
    const filename = path.basename(data.file.filename, storage.extention);
    if ( !(await exists(storage.filepath)) ) {
        await mkdir(storage.filepath)
    }
    await writeFile(path.join(storage.filepath, storage.filename + storage.extention), file.file, 'binary');
    return await (
        new media({
        filename,
        mediatype: storage.mediatype,
        storedname: storage.filename,
        extention: storage.extention,
        url: `http://localhost:${process.env.PORT || 8000}/media/${storage.mediatype}/${data.chat._id}/${storage.filename}${storage.extention}`
    }).save());
}
