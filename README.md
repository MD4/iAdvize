# iAdvize

This my implementation of the iAdvize-VDM test.

Demo app:

[http://iadvize-md4.herokuapp.com/docs/](http://iadvize-md4.herokuapp.com/docs/)

## installation

### MongoDB instance

Before doing anything, please be sure that a MongoDB instance is running on localhost:27017.

```
mongod --dbpath <path to db>
```

### dependencies

Next, install NodeJS dependencies :

```
npm install
```

## run tests

Test command will execute gulp default task which:
 - check lint
 - import a test-data-dump in MongoDB
 - run an API instance (in "test mode")
 - run each tests on it

```
npm test
```

Tests are in './test'.

## usage

Executable scripts are in './bin'.

### scrapper

The scrapper will scrape VDM website and store results in MongoDB.
```
npm run scrapper
```

You can also specify how much posts you will scrape (default is 200):
```
npm run scrapper 50
```

### serve API

In order to start an instance of the API, just type:

```
npm start
```

Then, go to:
 - API: [http://localhost:3000/api/](http://localhost:3000/api/)
 - Doc swagger-ui: [http://localhost:3000/docs/](http://localhost:3000/docs/)
 
## info

### why ?

Here I will explain succinctly why I used what I used.

The objective was to build something quickly.

#### NodeJS

For fast prototyping and its great tooling (package manager, task runner, libs, hosting solutions etc.) & community.

#### MongoDB

Again, for fast prototyping and its great community.

Here the need is simple because we have to store documents representing the posts scrapped.

### lib used

#### swagger.io

Swagger is a simple yet powerful representation of your RESTful API. With the largest ecosystem of API tooling on the planet, thousands of developers are supporting Swagger in almost every modern programming language and deployment environment. With a Swagger-enabled API, you get interactive documentation, client SDK generation and discoverability.

[http://swagger.io/](http://swagger.io/)

#### async

Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.

[https://github.com/caolan/async](https://github.com/caolan/async)

#### cherrio

Fast, flexible, and lean implementation of core jQuery designed specifically for the server.

[https://github.com/cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)

#### momentjs

Parse, validate, manipulate, and display dates in JavaScript.

[http://momentjs.com/](http://momentjs.com/)

#### supertest

Super-agent driven library for testing node.js HTTP servers using a fluent API

[https://github.com/visionmedia/supertest](https://github.com/visionmedia/supertest)

#### chai/should

should is an expressive, readable, test framework agnostic, assertion library. Main goals of this library to be expressive and to be helpful. It keeps your test code clean, and your error messages helpful.

[http://chaijs.com/api/bdd/](http://chaijs.com/api/bdd/)

### tools

#### gulp

Gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.

[http://gulpjs.com/](http://gulpjs.com/)