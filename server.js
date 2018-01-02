'use strict';

const swaggerDoc = require('./swagger.json');
const apiDoc = require('./lib/swaggerDoc')(swaggerDoc);
const express = require('express');
const swaggerTools = require('swagger-tools');
const config = require('./config');
const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || 'TEST';
const PORT = config[NODE_ENV].port;
const log4js = require('log4js');
const logger = log4js.getLogger();
//log4js requires to turn on logging
logger.level = 'debug';

let httpserver;

//start service
const start = (cb)=>{
  swaggerTools.initializeMiddleware(apiDoc, (middleware)=>{
  	let app = express();
  	httpserver = require('http').createServer(app);

  	//connect to main database
  	mongoose.connect(`mongodb://${config[NODE_ENV].databaseServer}/${config[NODE_ENV].databaseName}`);
  	mongoose.connection.on('error', (error)=>{return cb(new Error('DB connection error:'))});
  	mongoose.connection.on('connected',()=>{
  		logger.info(`Mongoose connected to ${NODE_ENV} DB on ip --> ${config[NODE_ENV].databaseServer}/${config[NODE_ENV].databaseName}`);
  		app.use((req, res, next)=>{
        //necessary for cross-domain request
  			res.header("Access-Control-Allow-Origin", "*");
  			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  			next();
  		});
      //init Swagger settings
  		app.use(middleware.swaggerMetadata());
  		app.use(middleware.swaggerValidator());
  		app.use(middleware.swaggerRouter({controllers: './api/controllers'}));
  		app.use(middleware.swaggerUi()); // Swagger documents and Swagger UI
  		httpserver.listen(PORT, (err)=>{
  			 if(err)return cb(new Error(`${error.message}`));
         return cb();
  		});
  	});
  });
}

module.exports = {start};
