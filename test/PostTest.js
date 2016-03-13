var should = require('should');
var assert = require('assert');
var request = require('supertest');

var api = require('../src/api/api');

describe('API', function () {
    var url = 'http://localhost:3000';

    before(function (done) {
        api.start(true, done);
    });

    after(function () {
        api.stop();
    });

    describe('Posts', function () {

        it('should return post by id', function (done) {
            request(url)
                .get('/api/posts/8690822')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.post.should.have.property('id', '8690822');
                    res.body.post.should.have.property('author', 'Anonyme');
                    res.body.post.should.have.property('content', 'Aujourd\'hui, en retard au travail, je file quand même acheter du papier toilette et du coca. Arrivée à la caisse je demande poliment si je peux passer "car c\'est vraiment pressé". Et c\'est sous le regard compatissant de toute la file d\'attente que j\'ai pu avoir la priorité. VDM');
                    res.body.post.should.have.property('date', '1970-01-01T00:00:00.000Z');
                    done();
                });
        });

        it('should return an error when the id is unexisting', function (done) {
            request(url)
                .get('/api/posts/badid')
                .expect(404)
                .end(done);
        });

    });

});