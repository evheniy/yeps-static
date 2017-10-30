const debug = require('debug')('yeps:static:cache');

module.exports = async (eTag, ctx) => {
  if (eTag && ctx.req.headers.etag) {
    ctx.res.statusCode = 304;
    debug('ETag: %s', ctx.req.headers.etag);

    ctx.res.end();
    debug('End of response');

    return Promise.reject();
  }

  return Promise.resolve();
};
