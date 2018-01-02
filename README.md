# Questionnaire Microservice Demo Project

This demo is a microservice to manage one or more questionnaires. There are three basic endpoints.

  - /start
  - /next
  - /summary

# Required Input

  - Each endpoint requires a unique session id. You must pass a unique session id each execution
  - To allow the microservice to handle multiple questionnaires, you must also pass the id of the desired questionnaire to the /start and /next endpoints.

# Assumptions Made
  - Microservice will handle multiple questionnaires
  - User can only select from provided answers
  - Session Id is created outside of microservice

# Potential New Features
  - Tracking remaining quesitons per questionnaire

# How to Answer Questions
  - To answer each question, you will need to pass the id of the said question and answer selected.

# Swagger UI Integration
What does this mean:
  - You can test the use of each endpoint by going to the url http://localhost:4000/docs once you start the microservice

### Tech

Open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [SwaggerTools] - middleware for express to handle basic endpoint validation
* [Async] - library for managing flow of async calls
* [MongoDB] - noSQL document based object oriented data store

### Testing Framework

Open source projects to work properly:

* [Mocha]
* [Chai]
* [Istanbul]


### Installation

Requires [Node.js](https://nodejs.org/) v6+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ sudo ./seed
$ npm install -d
$ npm start
```

### Testing

Requires [Node.js](https://nodejs.org/) v6+ to run.

Test the code please run the following command. This will start the server, so please stop it if you have it running already.

```sh
$ npm test
```

### Coverage

Run code coverage. This will start the server, so please stop it if you have it running already.

```sh
$ npm run coverage
```
