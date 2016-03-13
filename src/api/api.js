'use strict';

var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');

var MongoHelper = require('../common/helpers/MongoHelper');

// exports

module.exports.start = _start;
module.exports.stop = _stop;

// private

var serverPort = 3000;
var server;

// swaggerRouter configuration
var options = {
    swaggerUi: '/swagger.json',
    controllers: './src/api/controllers',
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};


function _start(test, callback) {
    console.log('Starting api !');

    MongoHelper.connect(function () {
        _initializeSwagger(callback);
    }, test);
}

function _initializeSwagger(callback) {
    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    var spec = fs.readFileSync('./src/api/config/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator());

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());

        // Start the server
        server = http.createServer(app);
        server.listen(serverPort, function () {
            console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
            console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

            if (callback) {
                callback();
            }
        });
    });
}

function _stop() {
    MongoHelper.finalize();
    server.close();
}

