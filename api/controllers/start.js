'use strict';

const models = require('questionnaire-models');
const Questionnaire = models.Questionnaire;
const Session = models.Session;
const async = require('async');
const sessionIdCreator = require('../../lib/sessionIdCreator');
const objectPath = require('simple-object-path');

const start = (req, res)=>{
  const questionnaireId = objectPath(req,'swagger/params/questionnaireId/value');
  const sessionId = objectPath(req,'swagger/params/sessionId/value');

  let _firstQuestion;

  //get Questionnaire's questions
  const getFirstQuestion = (_callback)=>{
    const query = {_id : questionnaireId};
    Questionnaire
      .findOne(query)
      .populate({path : 'questions'})
      .exec((err, questionnaire)=>{
         if(err)return _callback(err);
         _firstQuestion = questionnaire.questions[0];
         return _callback();
      });
  };

  //store session to our db
  const storeSession = (_callback)=>{
    const newSession = new Session({id : sessionId, questionnaire : questionnaireId});
    newSession.save((err)=>{
      if(err)return _callback(err);
      return _callback();
    });
  };

  //use async for flow control
  async.series([getFirstQuestion, storeSession], (err)=>{
    if(err){
      logger.error(`Issue in Start Api ${err.message}`);
      return res.status(500).send({message: err.message})
    }
    return res.status(200).send({question : _firstQuestion});
  });
}

module.exports = {start};
