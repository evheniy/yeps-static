const debug = require('debug')('yeps:static:index');

const methodCheck = require('./lib/methodCheck');
const cacheCheck = require('./lib/cacheCheck');
const getPath = require('./lib/getPath');
const getStats = require('./lib/getStats');
const getType = require('./lib/getType');
const getEncoding = require('./lib/getEncoding');
const fileStream = require('./lib/fileStream');
const gzipFileStream = require('./lib/gzipFileStream');

module.exports = ({root = __dirname, index = 'index.html', etag = true, gzip = true, maxage = 0} = {}) => async context => {

    debug('YEPS Static');
    debug('Headers: %O', context.req.headers);

    try {
        await methodCheck(context.req.method.toUpperCase());
        await cacheCheck(etag, context);
        let path = await getPath(root, index, context.req.url);
        const type = getType(path);
        const stats = await getStats(index, path);
        path = stats.path;
        const encoding = getEncoding(context.req.headers['accept-encoding']);

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

        if (gzip) {
            context.res.setHeader('Content-Encoding', encoding);
            debug('Content-Encoding: %s', encoding);
        }

        context.res.statusCode = 200;

        if (gzip) {
            debug('gzip enabled!');
            debug('Encoding: %s', encoding);

            await gzipFileStream(path, context.res, encoding);
        } else {
            await fileStream(path, context.res);
        }
    } catch (error) {
        debug('Error: %O', error);

        if (error && !['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(error.code)) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    }

    return Promise.reject();
};
