# YEPS static

YEPS Static file serving

[![NPM](https://nodei.co/npm/yeps-static.png)](https://npmjs.org/package/yeps-static)

[![npm version](https://badge.fury.io/js/yeps-static.svg)](https://badge.fury.io/js/yeps-static)
[![Build Status](https://travis-ci.org/evheniy/yeps-static.svg?branch=master)](https://travis-ci.org/evheniy/yeps-static)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-static/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-static?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-static/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-static/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-static)

[![Dependency Status](https://david-dm.org/evheniy/yeps-static.svg)](https://david-dm.org/evheniy/yeps-static)
[![devDependency Status](https://david-dm.org/evheniy/yeps-static/dev-status.svg)](https://david-dm.org/evheniy/yeps-static#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-static)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-static/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-static.svg)](https://github.com/evheniy/yeps-static/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-static.svg)](https://github.com/evheniy/yeps-static/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-static.svg)](https://github.com/evheniy/yeps-static/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-static.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-static
  

## How to use

    const App = require('yeps');
    const serve = require('yeps-static');
    const error = require('yeps-error');
    
    const app = new App();
    
    app.all([
        serve(),
        error(),
    ]);

Or with options:

    const { resolve } = require('path');
    
    app.all([
        serve({
            root: resolve(__dirname, 'public'),
            index: 'index.html',
            etag: true,
            gzip: true,
        }),
        error(),
    ]);
    
#### With virtual host

    const App = require('yeps');
    const VirtualHost = require('yeps-virtual-host');
    const Router = require('yeps-router');
    const error = require('yeps-error');
    
    const { resolve } = require('path');
    
    const vhost = new VirtualHost();
    const router = new Router();
    const serve = require('yeps-static');
    
        
    const app = new App();
    app.then(error());
    
    router.get('/').then(async ctx => {
        ctx.res.statusCode = 200;
        ctx.res.setHeader('Content-Type', 'application/json');
        ctx.res.end('{"status":"OK"}'); 
    });
    
    vhost
        .http('api.yeps.info')
        .then(router.resolve());
        
    vhost
        .http('static.yeps.info')
        .then(serve({ 
            root: resolve(__dirname, 'files')
        }));

    app.then(vhost.resolve());
    
#### [YEPS documentation](http://yeps.info/)