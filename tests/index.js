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
            .get('/index.html')
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

        app.then(serve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

});
