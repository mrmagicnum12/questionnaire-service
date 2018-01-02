'use strict';

const models = require('questionnaire-models');
const Question = models.Question;
const Session = models.Session;
const async = require('async');
const objectPath = require('simple-object-path');
const log4js = require('log4js');
const logger = log4js.getLogger();
//log4js requires to turn on logging
logger.level = 'debug';

const summary = (req, res)=>{
  const sessionId = objectPath(req,'swagger/params/sessionId/value');
  let _message;
  let _answeredQuestions = [];
  let _answeredQuestionsWithDetails = {};

  //store session answer and set questions answered
  const getSession = (_callback)=>{
    const query = {id : sessionId};
    Session.findOne(query, (err, session)=>{
        if(err)return _callback(err);
        if(session){
          _answeredQuestions = session.questions;
        }else{
          return _callback(new Error(`User Session Id is not valid --> ${sessionId}`));
        }
        return _callback();
    });
  };

  //get next Questionnaire's questions
  const getAllQuestionsAnswered = (_callback)=>{
    let answered = {};

    //get actual question and answer
    const getDetails = (questionId, answerId, _cb)=>{
      const query = {_id : questionId};
      Question.findOne(query, (err, question)=>{
        if(err)return _cb(err);
        if(question){
          let answer = question.answers.filter(a=>{return a._id.toString() === answerId})[0];
          _answeredQuestionsWithDetails[question.question]=answer.answer;
        }
        return _cb();
      });
    }

    //loop thru answered questions for this sessionId
    _answeredQuestions.forEach(q=>{
      answered[q._id]=getDetails.bind(null,q.questionId,q.answerId);
    });

    //get all details at once
    async.parallel(answered, error=>{
      if(error)return _callback(error);
      return _callback();
    });
  };

  //use async for flow control
  async.series([getSession, getAllQuestionsAnswered], (err)=>{
    if(err){
      logger.error(`Issue in Summary Api ${err.message}`);
      if(err.message.includes(`User Session Id is not valid`))return res.status(401).send({message: err.message});
      return res.status(500).send({message: err.message});
    }
    return res.status(200).send({summary : _answeredQuestionsWithDetails, message : _message});
  });
}

module.exports = {summary};
