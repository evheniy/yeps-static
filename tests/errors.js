const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const serve = require('..');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('YEPS static errors', async () => {

    beforeEach(() => {
        app = new App();
        app.then(error());
    });

    it('should test file readStream error', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            gzip: false
        }));

        global.yepsTestReadStream = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test file response error', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            gzip: false
        }));

        global.yepsTestResponseError = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test file response close', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname,
            gzip: false
        }));

        global.yepsTestResponseClose = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test zip readStream error', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        global.yepsZipTestReadStream = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test zip zipStream error', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        global.yepsZipTestZipStream = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test zip response error', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        global.yepsZipTestResponseError = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test zip response close', async () => {
        let isTestFinished = false;

        app.then(serve({
            root: __dirname
        }));

        global.yepsZipTestResponseClose = true;

        await chai.request(http.createServer(app.resolve()))
            .get('/files/index.html')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

});
