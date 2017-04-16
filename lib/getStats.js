const debug = require('debug')('yeps:static:stats');
const { stat } = require('mz/fs');
const { resolve } = require('path');

module.exports = async (index, path) => {

    let stats = await stat(path);
    debug('Stats: %O', stats);

    if (stats.isDirectory()) {
        path = resolve(path, index);
        debug('Path: %s', path);

        stats = await stat(path);
        debug('Stats: %O', stats);
    }

    stats.path = path;

    return stats;
};