var async = require('async');

var MongoHelper = require('../../common/helpers/MongoHelper');

// exports

module.exports.storePosts = _storePosts;

// private

/**
 * Stores posts in database
 * @param posts Posts to store
 * @param callback
 * @private
 */
function _storePosts(posts, callback) {
    async.parallel(
        posts
            .map(function (post) {
                return _storePostIt(post);
            }),
        callback
    );
}

/**
 * Stores an post in database
 * @param post Post to store
 * @returns {Function}
 * @private
 */
function _storePostIt(post) {
    return function (callback) {
        MongoHelper
            .getCollection(MongoHelper.CollectionsNames.POSTS)
            .save(
                post,
                callback
            );
    };
}