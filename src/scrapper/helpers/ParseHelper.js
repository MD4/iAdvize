// exports

module.exports.parseAuthor = _parseAuthor;
module.exports.parseDate = _parseDate;

// private

/**
 * Extracts the post author from the raw html element text
 * @param string
 * @returns {string}
 * @private
 */
function _parseAuthor(string) {
    return string
        .replace('par ', '')
        .trim();
}

/**
 * Extracts the post date from the raw html element text
 * @param string
 * @returns {Date}
 * @private
 */
function _parseDate(string) {
    return new Date(
        Date.parse(
            string
                .replace('Le ', '')
                .replace(' à ', ' ')
        )
    );
}