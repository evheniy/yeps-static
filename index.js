const debug = require('debug')('yeps:static');
const mime = require('mime-types');
const { createReadStream } = require('fs');
const { stat } = require('mz/fs');
const resolvePath = require('resolve-path');
const zlib = require('zlib');
const {
    extname,
    parse,
    normalize,
    resolve
} = require('path');

const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];

const getEncoding = (contentEncoding = '') => contentEncoding.includes('deflate') ? 'deflate' : 'gzip';

const getType = path => mime.contentType(extname(path));

module.exports = ({root = __dirname, index = 'index.html', etag = true, gzip = true, maxage = 0} = {}) => async context => {

    debug('YEPS Static');
    debug('Headers: %O', context.req.headers);

    if (!['HEAD', 'GET'].includes(context.req.method.toUpperCase())) {
        context.res.statusCode = 404;
        debug('Wrong method: %s', context.req.method);

        context.res.end();
        debug('End of response');

        return Promise.reject();
    }

    if (etag && context.req.headers.etag) {

        context.res.statusCode = 304;
        debug('etag: %s', context.req.headers.etag);

        context.res.end();
        debug('End of response');

        return Promise.reject();

    } else {
        try {
            let path = context.req.url;
            path = path.substr(parse(path).root.length);

            path = decodeURIComponent(path);
            debug('Path: %s', path);

            const trailingSlash = path[path.length - 1] === '/';

            if (trailingSlash) {
                path += index;
                debug('Path: %s', path);
            }

            const directory = normalize(resolve(root));
            debug('Directory: %s', directory);

            path = resolvePath(directory, path);
            debug('Path: %s', path);

            let stats = await stat(path);
            debug('Stats: %O', stats);

            if (stats.isDirectory()) {
                path = resolve(path, index);
                debug('Path: %s', path);

                stats = await stat(path);
                debug('Stats: %O', stats);
            }

            context.res.setHeader('Last-Modified', stats.mtime.toUTCString());
            debug('Last-Modified: %s', stats.mtime.toUTCString());

            if (etag) {
                context.res.setHeader('ETag', path);
                debug('ETag: %s', path);
            }

            if (maxage) {
                context.res.setHeader('Cache-Control', `max-age=${(maxage / 1000 | 0)}`);
                debug('Cache-Control: %s', `max-age=${(maxage / 1000 | 0)}`);
            }

            const type = getType(path);
            context.res.setHeader('Content-Type', type);
            debug('Content-Type: %s', type);

            context.res.statusCode = 200;

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

            debug('End of response');
            context.res.end();

        } catch (error) {
            debug('Error: %O', error);

            if (!notfound.includes(error.code)) {
                return Promise.reject(error);
            }

            return Promise.resolve();
        }
    }

    return Promise.reject();
};
