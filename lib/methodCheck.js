const debug = require('debug')('yeps:static:head');

module.exports = async (method) => {
  debug('Method: %s', method);

  return ['HEAD', 'GET'].includes(method) ? Promise.resolve() : Promise.reject();
};
