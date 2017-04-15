const debug = require('debug')('yeps:static');
const mime = require('mime-types');
const fs = require('fs');
const resolvePath = require('resolve-path');
const zlib = require('zlib');
const {
    normalize,
    extname,
    resolve,
    parse
} = require('path');

const getEncoding = (contentEncoding = '') => contentEncoding.includes('deflate') ? 'deflate' : 'gzip';

const getType = path => mime.contentType(extname(path));

const getPath = (directory, url, index) => {

    let path = context.req.url;

    path = path.substr(parse(path).root.length);

    const trailingSlash = path[path.length - 1] === '/';

    path = decodeURIComponent(path);

    if (trailingSlash) {
        path += index;
    }

    return resolvePath(root, path);
};

module.exports = ({ root = __dirname, index = 'index.html', eTag = true, gzip = true} = {}) => async context => {

    debug('YEPS Static');

    if (eTag && context.req.headers.etag) {

        context.res.statusCode = 304;
        debug('etag: %s', context.req.headers.etag);

        context.res.end();
        debug('End of response');

        return Promise.reject();

    } else {
        const path = getPath(normalize(resolve(root)), context.req.url, index);

        debug('Path: %s', path);

        const type = getType(path);

        context.res.setHeader('Content-Type', type);
        debug('Content-Type: %s', type);

        context.res.statusCode = 200;

        const readStream = fs.createReadStream(path);

        if (gzip) {
            debug('gzip enabled!');

            const encoding = getEncoding(context.req.headers['accept-encoding']);

            debug('Encoding: %s', encoding);

            const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();

            context.res.setHeader('Content-Encoding', encoding);

            debug('Content-Encoding: %s', encoding);

            readStream.pipe(zipStream).pipe(context.res).on('error', error => {
                debug(error);
                readStream.destroy();
                context.res.statusCode = 404;
                zipStream.destroy();
                context.res.destroy();
            });

        } else {
            readStream.pipe(context.res).on('error', error => {
                debug(error);
                readStream.destroy();
                context.res.statusCode = 404;
                context.res.destroy();
            });
        }

        debug('End of response');
        context.res.end();

        return Promise.reject();
    }
};
