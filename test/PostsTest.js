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
        it('should return all posts', function (done) {
            request(url)
                .get('/api/posts')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('count', 65);
                    res.body.should.have.property('posts').with.lengthOf(65);

                    res.body.posts[1].should.have.property('id');
                    res.body.posts[1].should.have.property('author');
                    res.body.posts[1].should.have.property('content');
                    res.body.posts[1].should.have.property('date');
                    done();
                });
        });

        it('should return all post for a given author', function (done) {
            request(url)
                .get('/api/posts?author=Anonyme')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('count', 8);
                    res.body.should.have.property('posts').with.lengthOf(8);

                    res.body.posts[1].should.have.property('id');
                    res.body.posts[1].should.have.property('author');
                    res.body.posts[1].should.have.property('content');
                    res.body.posts[1].should.have.property('date');
                    done();
                });
        });

        it('should return all posts starting from a date', function (done) {
            request(url)
                .get('/api/posts?from=2016-12-03')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('count', 5);
                    res.body.should.have.property('posts').with.lengthOf(5);

                    res.body.posts[1].should.have.property('id');
                    res.body.posts[1].should.have.property('author');
                    res.body.posts[1].should.have.property('content');
                    res.body.posts[1].should.have.property('date');
                    done();
                });
        });

        it('should return all posts starting from a date', function (done) {
            request(url)
                .get('/api/posts?to=2016-07-03')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('count', 16);
                    res.body.should.have.property('posts').with.lengthOf(16);

                    res.body.posts[1].should.have.property('id');
                    res.body.posts[1].should.have.property('author');
                    res.body.posts[1].should.have.property('content');
                    res.body.posts[1].should.have.property('date');
                    done();
                });
        });

        it('should return all posts starting from a date', function (done) {
            request(url)
                .get('/api/posts?from=2016-10-03&to=2016-11-03')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('count', 17);
                    res.body.should.have.property('posts').with.lengthOf(17);

                    res.body.posts[1].should.have.property('id');
                    res.body.posts[1].should.have.property('author');
                    res.body.posts[1].should.have.property('content');
                    res.body.posts[1].should.have.property('date');
                    done();
                });
        });

    });

});