const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');
const Router = require('yeps-router');
const VirtualHost = require('yeps-virtual-host');
const serve = require('..');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('YEPS static', async () => {
  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test etag', async () => {
    let isTestFinished = false;

    app.then(serve());

    await chai.request(server)
      .get('/files/index.html')
      .set('etag', '/index.html')
      .send()
      .catch((err) => {
        expect(err).to.have.status(304);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test index file', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test without gzip', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
      gzip: false,
    }));

    await chai.request(server)
      .get('/files/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers['content-encoding']).to.be.undefined;
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/index.html')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files/../../../../test.html')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test etag: false', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
      etag: false,
    }));

    await chai.request(server)
      .get('/files/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers.etag).to.be.undefined;
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test maxage', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
      maxage: 9000,
    }));

    await chai.request(server)
      .get('/files/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers['cache-control']).to.be.equal('max-age=9');
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test deflate', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files/')
      .set('Accept-Encoding', 'gzip,deflate')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers['content-encoding']).to.be.equal('deflate');
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test gzip', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files/')
      .set('Accept-Encoding', 'gzip')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers['content-encoding']).to.be.equal('gzip');
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test wrong method', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .delete('/files/index.html')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test gzip', async () => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      delete ctx.req.headers['accept-encoding'];
    });

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files/index.html')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.headers['content-encoding']).to.be.equal('gzip');
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test directory', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
    }));

    await chai.request(server)
      .get('/files')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test directory without gzip', async () => {
    let isTestFinished = false;

    app.then(serve({
      root: __dirname,
      gzip: false,
    }));

    await chai.request(server)
      .get('/files')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test virtual host with router from readme', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    const vhost = new VirtualHost();
    const router = new Router();

    router.get('/').then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', 'application/json');
      ctx.res.end(JSON.stringify({ status: 'OK' }));
    });

    vhost
      .http('api.yeps.info')
      .then(router.resolve());

    vhost
      .http('static.yeps.info')
      .then(serve({
        root: __dirname,
      }));

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'api.yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.be.equal('OK');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/files/index.html')
      .set('Host', 'static.yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('<div>Index</div>');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });
});
