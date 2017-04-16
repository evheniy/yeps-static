const debug = require('debug')('yeps:static:type');
const mime = require('mime-types');
const { extname } = require('path');

module.exports = path => mime.contentType(extname(path));
