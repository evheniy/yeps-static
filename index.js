const debug = require('debug')('yeps:static:index');

const methodCheck = require('./lib/methodCheck');
const cacheCheck = require('./lib/cacheCheck');
const getPath = require('./lib/getPath');
const getStats = require('./lib/getStats');
const getType = require('./lib/getType');

const {createReadStream} = require('fs');
const zlib = require('zlib');
const getEncoding = (contentEncoding = '') => contentEncoding.includes('deflate') ? 'deflate' : 'gzip';

module.exports = ({root = __dirname, index = 'index.html', etag = true, gzip = true, maxage = 0} = {}) => async context => {

    debug('YEPS Static');
    debug('Headers: %O', context.req.headers);

    let path, stats, type;

    try {
        await methodCheck(context);
        await cacheCheck(etag, context);
        path = await getPath(root, index, context.req.url);
        type = getType(path);
        stats = await getStats(index, path);

        const readStream = createReadStream(path);

        if (gzip) {
            debug('gzip enabled!');

            const encoding = getEncoding(context.req.headers['accept-encoding']);

            debug('Encoding: %s', encoding);

            const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();

            context.res.setHeader('Content-Encoding', encoding);

            debug('Content-Encoding: %s', encoding);

            readStream.pipe(zipStream).pipe(context.res);

        } else {
            readStream.pipe(context.res);
        }

    } catch (error) {
        debug('Error: %O', error);

        if (error && !['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(error.code)) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    }

    context.res.statusCode = 200;

    if (etag) {
        context.res.setHeader('ETag', context.req.url);
        debug('ETag: %s', context.req.url);
    }

    context.res.setHeader('Last-Modified', stats.mtime.toUTCString());
    debug('Last-Modified: %s', stats.mtime.toUTCString());

    if (maxage) {
        context.res.setHeader('Cache-Control', `max-age=${(maxage / 1000 | 0)}`);
        debug('Cache-Control: %s', `max-age=${(maxage / 1000 | 0)}`);
    }

    context.res.setHeader('Content-Type', type);
    debug('Content-Type: %s', type);

    debug('End of response');
    context.res.end();

    return Promise.reject();
};
