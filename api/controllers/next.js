'use strict';

const models = require('questionnaire-models');
const Questionnaire = models.Questionnaire;
const Session = models.Session;
const async = require('async');
const objectPath = require('simple-object-path');
const log4js = require('log4js');
const logger = log4js.getLogger();
//log4js requires to turn on logging
logger.level = 'debug';

//TODO
/*
  1) More Validation of question and answers
*/

const next = (req, res)=>{
  const sessionId = objectPath(req,'swagger/params/sessionId/value');
  const questionnaireId = objectPath(req,'swagger/params/questionnaireId/value');
  const question = objectPath(req,'swagger/params/body/value');
  let _answeredQuestionsMap = {};
  let _nextQuestion;
  let _message;

  //store session answer and set questions answered
  const storeAnswerToSession = (_callback)=>{
    const query = {id : sessionId};
    Session.findOne(query, (err, session)=>{
        if(err)return _callback(err);
        if(session){
          session.questions.forEach(q=>{return _answeredQuestionsMap[q.questionId]=true;});
          if(!_answeredQuestionsMap[question.questionId]){
            session.questions.push({questionId : question.questionId, answerId : question.answerId});
            _answeredQuestionsMap[question.questionId]=true;
            session.save(sessionError=>{
              if(sessionError)return _callback(sessionError);
              return _callback();
            });
          }else{
            return _callback();
          }
        }else{
          return _callback(new Error(`User Session Id is not valid --> ${sessionId}`));
        }
    });
  };

  //get next Questionnaire's questions
  const getNextQuestion = (_callback)=>{
    const query = {_id : questionnaireId};
    Questionnaire
      .findOne(query)
      .populate({path : 'questions'})
      .exec((err, questionnaire)=>{
         if(err)return _callback(err);
         if(questionnaire){
           let questions = questionnaire.questions.filter(q=>{return !_answeredQuestionsMap[q._id]});
           if(questions.length > 0){
             _nextQuestion = questions[0];
           }else{
             _message = `End of Questionnaire`;
           }
         }
         return _callback();
      });
  };

  //use async for flow control
  async.series([storeAnswerToSession, getNextQuestion], (err)=>{
    if(err){
      logger.error(`Issue in Next Api ${err.message}`);
      if(err.message.includes(`User Session Id is not valid`))return res.status(401).send({message: err.message});
      return res.status(500).send({message: err.message})
    }
    return res.status(200).send({question : _nextQuestion, message : _message});
  });
}

module.exports = {next};
