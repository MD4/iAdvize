var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var ParseHelper = require('./helpers/ParseHelper');
var StoreHelper = require('./helpers/StoreHelper');

var MongoHelper = require('../common/helpers/MongoHelper');

// exports

module.exports.start = _start;

// private

/**
 * Number of posts on a single page
 * @type {number}
 */
var POSTS_PER_PAGE = 13;

/**
 * Number of posts to fetch
 * @type {number}
 */
var POSTS_TO_FETCH = +process.argv[2] || 200;

/**
 * Base url to scrappe
 * @type {string}
 */
var BASE_URL = 'http://www.viedemerde.fr/?page=';


/**
 * Initialize scrapper & begins to scrappe
 * @private
 */
function _start() {
    MongoHelper.connect(_fetchPosts);
}

/**
 * Build each request to fetch posts
 * @private
 */
function _fetchPosts() {
    var queries = [];

    // Builds each query to execute
    for (var i = 0; i * POSTS_PER_PAGE < POSTS_TO_FETCH; i++) {
        queries.push(_buildRequest(BASE_URL + i));
    }

    // Execute each query
    async.parallel(
        queries,
        function (err, results) {
            // Flatten results
            var posts = [].concat.apply([], results);

            console.log('Done. %s posts fetched.', posts.length);
            console.log('Storing posts...');

            StoreHelper.storePosts(posts, function () {
                console.log('Done.');

                MongoHelper.finalize();
                process.exit();
            });
        }
    );
}

/**
 * Builds a request
 * @param url url to scrappe
 * @returns {Function} Request to execute
 * @private
 */
function _buildRequest(url) {

    return function (callback) {

        console.log('Scrapping %s...', url);

        request(url, _requestResponseHandler(callback));

    };

}

/**
 * Builds a request response handler
 * @param callback
 * @returns {Function} Request response handler
 * @private
 */
function _requestResponseHandler(callback) {
    return function (error, response, body) {
        if (error) {
            return callback(error);
        }

        var $ = cheerio.load(body);
        var $posts = $('.article');

        var posts = $posts
            .map(_parsePostHandler($))
            .get();

        callback(null, posts);
    };
}

/**
 * Builds an handler which extracts an post from a parsed response body
 * @param $
 * @returns {Function}
 * @private
 */
function _parsePostHandler($) {
    return function (i, $post) {

        var dateAuthorAggregate = $($post)
            .find('.date .right_part p:nth-child(2)')
            .text()
            .split(' - ');

        var date = dateAuthorAggregate[0];
        var author = dateAuthorAggregate[2];

        return {
            _id: $($post).attr('id'),
            content: $($post).find('> p').text(),
            date: ParseHelper.parseDate(date),
            author: ParseHelper.parseAuthor(author)
        };

    };
}