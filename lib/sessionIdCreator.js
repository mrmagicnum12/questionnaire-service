'use strict';
const uuidv4 = require('uuid/v4');

const create = (cb)=>{
   const sessionId = uuidv4();
   return cb(null,sessionId);
};

module.exports = {create};
