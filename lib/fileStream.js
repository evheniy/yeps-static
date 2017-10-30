const debug = require('debug')('yeps:static:file');
const { createReadStream } = require('fs');

module.exports = (path, response) => new Promise((resolve, reject) => {
  debug(path);
  const readStream = createReadStream(path);

  const wrongFlowHandle = (error) => {
    debug(error);
    readStream.destroy();
    response.statusCode = 500;
    response.end();
    reject(error);
  };

  readStream.pipe(response);

  readStream.on('error', wrongFlowHandle);

  response
    .on('error', wrongFlowHandle)
    .on('close', wrongFlowHandle)
    .on('finish', () => {
      debug('finish');
      resolve();
    });

  // for testing
  if (global.yepsTestReadStream) {
    debug('yepsTestReadStream');
    readStream.emit('error', new Error('Read stream test error'));
    delete global.yepsTestReadStream;
  }

  if (global.yepsTestResponseError) {
    debug('yepsTestReyepsTestResponseErroradStream');
    response.emit('error', new Error('Response test error'));
    delete global.yepsTestResponseError;
  }

  if (global.yepsTestResponseClose) {
    debug('yepsTestResponseClose');
    response.emit('close');
    delete global.yepsTestResponseClose;
  }
});
