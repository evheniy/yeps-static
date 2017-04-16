const debug = require('debug')('yeps:static:file');
const { createReadStream } = require('fs');

module.exports = (path, response) => new Promise((resolve, reject) => {

    const readStream = createReadStream(path);

    readStream.pipe(response);

    readStream.on('error', error => {
        readStream.destroy();
        reject(error);
    });

    response.on('error', error => {
        readStream.destroy();
        reject(error);
    }).on('close', () => {
        readStream.destroy();
        resolve();
    }).on('finish', () => {
        resolve();
    });
});
