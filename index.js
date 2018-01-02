'use strict';

const server = require('./server');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

server.start((error)=>{
  if(error)return logger.error(error.message);
  logger.info(`Questionnaire Service Up And Running`);
});
