const debug = require('debug')('yeps:static:file');
const { createReadStream } = require('fs');

module.exports = (path, response) => new Promise((resolve, reject) => {

    const readStream = createReadStream(path);

    readStream.pipe(response);

    /* istanbul ignore next */
    readStream.on('error', error => {
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
