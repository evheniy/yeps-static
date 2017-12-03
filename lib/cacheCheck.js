const debug = require('debug')('yeps:static:cache');

module.exports = async (eTag, ctx) => {
  if (ctx.req.headers['if-none-match']) {
    ctx.req.headers.etag = ctx.req.headers['if-none-match'];
    debug('If-None-Match: %s', ctx.req.headers['if-none-match']);
  }

  if (eTag && ctx.req.headers.etag) {
    ctx.res.statusCode = 304;
    debug('ETag: %s', ctx.req.headers.etag);

    ctx.res.end();
    debug('End of response');

    return Promise.reject();
  }

  if (ctx.req.headers['if-modified-since']) {
    debug('If-Modified-Since: %s', ctx.req.headers['if-modified-since']);

    ctx.res.statusCode = 304;
    ctx.res.end();
    debug('End of response');

    return Promise.reject();
  }

  return Promise.resolve();
};
