var MongoClient = require('mongodb').MongoClient;
var db;

var CollectionsNames = {
    ARTICLES: 'articles'
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
 * @private
 */
function _connect(callback) {
    var uri = 'mongodb://localhost:27017/iadvize';

    console.log('Database connection: %s', uri);

    MongoClient.connect(
        uri,
        function (err, database) {
            db = database;
            callback(err);
        }
    );
}

/**
 * Closes the connection to the database
 * @private
 */
function _finalize() {
    db.close();
    console.log('Database connection closed.');
}