'use strict';

const models = require('questionnaire-models');
const Questionnaire = models.Questionnaire;
const Session = models.Session;
const async = require('async');
const sessionIdCreator = require('../../lib/sessionIdCreator');
const objectPath = require('simple-object-path');

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
  let _messsage;

  //store session answer and set questions answered
  const storeAnswerToSession = (_callback)=>{
    const query = {id : sessionId};
    Session.findOne((err, session)=>{
        if(err)return _callback(err);
        if(session){
          session.questions.forEach(q=>{return _answeredQuestionsMap[q.questionId]=true;});
          if(!_answeredQuestionsMap[question.questionId]){
            session.questions.push({questionId : question.questionId, answer : question.answerId});
            _answeredQuestionsMap[question.questionId]=true;
            session.save(sessionError=>{
              if(sessionError)return _callback(sessionError);
              return _callback();
            });
          }else{
            return _callback();
          }
        }else{
          return _callback();
        }
    });
  };

  //get next Questionnaire's questions
  const get_nextQuestion = (_callback)=>{
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
             _messsage = `End of Questionnaire`;
           }
         }
         return _callback();
      });
  };

  //use async for flow control
  async.series([storeAnswerToSession, get_nextQuestion], (err)=>{
    if(err){
      logger.error(`Issue in Next Api ${err.message}`);
      return res.status(500).send({message: err.message})
    }
    return res.status(200).send({question : _nextQuestion, message : _messsage});
  });
}

module.exports = {next};
