const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const serve = require('..');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('YEPS static', async () => {

    beforeEach(() => {
        app = new App();
        app.then(error());
    });

    it('should test etag', async () => {
        let isTestFinished = false;

        app.then(serve());

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .set('etag', '/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(304);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test index file', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test without gzip', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            gzip: false
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers['content-encoding']).to.be.undefined;
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test 404', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test 500', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/../../../../test.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test etag: false', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            etag: false
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers.etag).to.be.undefined;
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test maxage', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            maxage: 9000
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers['cache-control']).to.be.equal('max-age=9');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test deflate', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .set('Accept-Encoding', 'gzip,deflate')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers['content-encoding']).to.be.equal('deflate');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test gzip', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/')
            .set('Accept-Encoding', 'gzip')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers['content-encoding']).to.be.equal('gzip');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test wrong method', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .delete('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test gzip', async () => {
        let isTestFinished = false;

        app.then(async ctx => {
            delete ctx.req.headers['accept-encoding'];
        });

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.headers['content-encoding']).to.be.equal('gzip');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test directory', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        await chai.request(http.createServer(app.resolve()))
            .get('/files')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

});
