const debug = require('debug')('yeps:static:gzip');
const { createReadStream } = require('fs');
const zlib = require('zlib');

module.exports = (path, response, encoding) => new Promise((resolve, reject) => {
  debug(path);
  debug(encoding);

  const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();
  const readStream = createReadStream(path);

  const wrongFlowHandle = (error) => {
    debug(error);
    zipStream.end();
    readStream.destroy();
    response.statusCode = 500;
    response.end();
    reject(error);
  };

  readStream.pipe(zipStream).pipe(response);

  readStream.on('error', wrongFlowHandle);
  zipStream.on('error', wrongFlowHandle);

  response
    .on('error', wrongFlowHandle)
    .on('close', wrongFlowHandle)
    .on('finish', () => {
      debug('finish');
      resolve();
    });


  // for testing
  if (global.yepsZipTestReadStream) {
    debug('yepsZipTestReadStream');
    readStream.emit('error', new Error('Read stream test error'));
    delete global.yepsZipTestReadStream;
  }

  if (global.yepsZipTestZipStream) {
    debug('yepsZipTestZipStream');
    zipStream.emit('error', new Error('Zip stream test error'));
    delete global.yepsZipTestZipStream;
  }

  if (global.yepsZipTestResponseError) {
    debug('yepsZipTestResponseError');
    response.emit('error', new Error('Zip stream test error'));
    delete global.yepsZipTestResponseError;
  }

  if (global.yepsZipTestResponseClose) {
    debug('yepsZipTestResponseClose');
    response.emit('close');
    delete global.yepsZipTestResponseClose;
  }
});
