'use strict';

var url = require('url');

var Posts = require('../services/PostsService');

// exports

module.exports.postsGET = _postsGET;
module.exports.postsGETone = _postsGETone;

// private

function _postsGET(req, res, next) {
    Posts.postsGET(req.swagger.params, res, next);
}


function _postsGETone(req, res, next) {
    Posts.postsGETone(req.swagger.params, res, next);
}