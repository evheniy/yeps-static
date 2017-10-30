const debug = require('debug')('yeps:static:stats');
const { stat } = require('mz/fs');
const { resolve } = require('path');

module.exports = async (index, path) => {
  let newPath = path;
  let stats = await stat(newPath);
  debug('Stats: %O', stats);

  if (stats.isDirectory()) {
    newPath = resolve(newPath, index);
    debug('Path: %s', newPath);

    stats = await stat(newPath);
    debug('Stats: %O', stats);
  }

  stats.path = newPath;

  return stats;
};
