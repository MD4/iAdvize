var async = require('async');

var MongoHelper = require('../../common/helpers/MongoHelper');

// exports

module.exports.storeArticles = _storeArticles;

// private

/**
 * Stores articles in database
 * @param articles Articles to store
 * @param callback
 * @private
 */
function _storeArticles(articles, callback) {
    async.parallel(
        articles
            .map(function (article) {
                return _storeArticleIt(article)
            }),
        callback
    );
}

/**
 * Stores an article in database
 * @param article Article to store
 * @returns {Function}
 * @private
 */
function _storeArticleIt(article) {
    return function (callback) {
        MongoHelper
            .getCollection(MongoHelper.CollectionsNames.ARTICLES)
            .save(
                article,
                callback
            );
    };
}