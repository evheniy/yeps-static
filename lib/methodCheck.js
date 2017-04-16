const debug = require('debug')('yeps:static:head');

module.exports = async ctx => {

    const method = ctx.req.method.toUpperCase();

    debug('Method: %s', method);

    return ['HEAD', 'GET'].includes(method) ? Promise.resolve() : Promise.reject();
};