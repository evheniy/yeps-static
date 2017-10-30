const debug = require('debug')('yeps:static:path');
const resolvePath = require('resolve-path');
const { parse, normalize, resolve } = require('path');

module.exports = async (root, index, url) => {
  let path = url;

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

  return path;
};
