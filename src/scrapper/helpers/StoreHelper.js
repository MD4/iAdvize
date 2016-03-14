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
    MongoHelper
        .getCollection(MongoHelper.CollectionsNames.POSTS)
        .insertMany(
            posts,
            callback
        );
}