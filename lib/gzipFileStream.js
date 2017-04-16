const debug = require('debug')('yeps:static:gzip');
const { createReadStream } = require('fs');
const zlib = require('zlib');

module.exports = (path, response, encoding = 'gzip') => new Promise((resolve, reject) => {

    const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();
    const readStream = createReadStream(path);

    readStream.pipe(zipStream).pipe(response);

    readStream.on('error', error => {
        readStream.destroy();
        reject(error);
    });

    zipStream.on('error', error => {
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
