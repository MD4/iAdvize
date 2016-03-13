'use strict';
var moment = require('moment');

var MongoHelper = require('../../common/helpers/MongoHelper');

// exports

exports.postsGET = _postsGET;
exports.postsGETone = _postsGETone;

// private

var postProjection = {
    _id: false,
    id: '$_id',
    author: '$author',
    content: '$content',
    date: '$date'
};

var dateFormat = 'YYYY-MM-DD';

/**
 * Returns all posts which matches the given criteria
 * @param args Parameters
 * @param res Response object
 * @private
 */
function _postsGET(args, res) {
    var author = args.author.value || '';
    var from = args.from.value;
    var to = args.to.value;

    var match = {};

    if (author) {
        match.author = author;
    }
    if (from || to) {
        match.$and = [];
    }
    if (from) {
        match.$and.push({date: {$gte: moment(from, dateFormat).toDate()}});
    }
    if (to) {
        match.$and.push({date: {$lte: moment(to, dateFormat).add(1, 'day').toDate()}});
    }

    MongoHelper
        .getCollection(MongoHelper.CollectionsNames.ARTICLES)
        .aggregate([
            {$match: match},
            {$project: postProjection}
        ])
        .toArray(function (err, articles) {
            if (!articles) {
                res.statusCode = 204;
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.setHeader('Content-Encoding', 'UTF-8');
                res.end(JSON.stringify({
                    posts: articles,
                    count: articles.length
                }));
            }
        });

}

/**
 * Returns a pot by its id
 * @param args Parameters
 * @param res Response object
 * @private
 */
function _postsGETone(args, res) {
    var postId = args.id.value;

    MongoHelper
        .getCollection(MongoHelper.CollectionsNames.ARTICLES)
        .aggregate([
            {$match: {_id: postId}},
            {$project: postProjection}
        ])
        .limit(1)
        .next(function (err, article) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            if (!article) {
                res.statusCode = 404;
                res.end();
            } else {
                res.end(JSON.stringify({
                    post: article
                }));
            }
        });

}