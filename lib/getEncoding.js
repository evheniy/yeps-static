const debug = require('debug')('yeps:static:encoding');

module.exports = (contentEncoding = '') => contentEncoding.includes('deflate') ? 'deflate' : 'gzip';
