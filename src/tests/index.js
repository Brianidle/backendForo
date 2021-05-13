const boot = require('../index').boot;
const shutdown = require('../index').shutdown;
const port = require('../index').port;
const superagent = require('superagent');
const expect = require('expect.js');

describe('authorization', () => {
    before(() => {
        boot();
    });

    it('should respond to GET', (done) => {
        superagent
            .get(`http://localhost:${port}/test`)
            .end((error, response) => {
                console.log(response.text);
                // expect(response.text).to.equal("Test");
                expect(response.status).to.equal(200);
                done();
            });
    });

    after(() => {
        shutdown();
    });
});