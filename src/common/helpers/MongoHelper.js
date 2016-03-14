var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var config = require('../config/config');

var db;

var CollectionsNames = {
    POSTS: 'posts'
};

// exports

module.exports.CollectionsNames = CollectionsNames;

module.exports.getDB = _getDB;
module.exports.connect = _connect;
module.exports.getCollection = _getCollection;
module.exports.finalize = _finalize;

// private


/**
 * Gets the current database connection instance
 * @returns {*}
 * @private
 */
function _getDB() {
    return db;
}

/**
 * Gets a collection by its name
 * @param name
 * @returns {Collection|*}
 * @private
 */
function _getCollection(name) {
    return db.collection(name);
}

/**
 * Initializes connection to the database
 * @param callback
 * @param test Test mode enabled or not
 * @private
 */
function _connect(callback, test) {
    var uri = config.db.uri + (test ? 'Test' : '');

    MongoClient.connect(
        uri,
        function (err, database) {
            db = database;

            if (test) {
                _initializeTestDatabase(callback);
            } else {
                callback(err);
            }
        }
    );
}

/**
 * Closes the connection to the database
 * @private
 */
function _finalize() {
    db.close();
}

/**
 * Initializes database content with test data
 * @param callback
 * @private
 */
function _initializeTestDatabase(callback) {
    var db = _getCollection(CollectionsNames.POSTS);
    var posts = require('../../../test/data/posts.json');

    posts.forEach(function(post) {
        if (!(post.date instanceof Date)) {
            post.date = moment(post.date.$date).toDate();
        }
    });

    db.drop();
    db.insertMany(
        posts,
        callback
    );
}