const debug = require('debug')('yeps:static:gzip');
const { createReadStream } = require('fs');
const zlib = require('zlib');

module.exports = (path, response, encoding) => new Promise((resolve, reject) => {

    const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();
    const readStream = createReadStream(path);

    readStream.pipe(zipStream).pipe(response);

    /* istanbul ignore next */
    readStream.on('error', error => {
        debug(error);
        readStream.destroy();
        reject(error);
    });

    /* istanbul ignore next */
    zipStream.on('error', error => {
        debug(error);
        readStream.destroy();
        reject(error);
    });

    /* istanbul ignore next */
    response.on('error', error => {
        debug(error);
        readStream.destroy();
        reject(error);
    }).on('close', () => {
        debug('close');
        readStream.destroy();
        resolve();
    }).on('finish', () => {
        debug('finish');
        resolve();
    });
});
