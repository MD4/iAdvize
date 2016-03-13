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
 * Number of articles on a single page
 * @type {number}
 */
var ARTICLES_PER_PAGE = 13;

/**
 * Number of articles to fetch
 * @type {number}
 */
var ARTICLES_TO_FETCH = +process.argv[2] || 200;

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
    MongoHelper.connect(_fetchArticles);
}

/**
 * Build each request to fetch articles
 * @private
 */
function _fetchArticles() {
    var queries = [];

    // Builds each query to execute
    for (var i = 0; i * ARTICLES_PER_PAGE < ARTICLES_TO_FETCH; i++) {
        queries.push(_buildRequest(BASE_URL + i));
    }

    // Execute each query
    async.parallel(
        queries,
        function (err, results) {
            // Flatten results
            var articles = [].concat.apply([], results);

            console.log('Done. %s articles fetched.', articles.length);
            console.log('Storing articles...');

            StoreHelper.storeArticles(articles, function () {
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
        var $articles = $('.article');

        var articles = $articles
            .map(_parseArticleHandler($))
            .get();

        callback(null, articles);
    };
}

/**
 * Builds an handler which extracts an article from a parsed response body
 * @param $
 * @returns {Function}
 * @private
 */
function _parseArticleHandler($) {
    return function (i, $article) {

        var dateAuthorAggregate = $($article)
            .find('.date .right_part p:nth-child(2)')
            .text()
            .split(' - ');

        var date = dateAuthorAggregate[0];
        var author = dateAuthorAggregate[2];

        return {
            _id: $($article).attr('id'),
            content: $($article).find('> p').text(),
            date: ParseHelper.parseDate(date),
            author: ParseHelper.parseAuthor(author)
        };

    };
}