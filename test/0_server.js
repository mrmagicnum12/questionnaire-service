'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const models = require('questionnaire-models');
const Session = models.Session;

describe("Starting Questionnaire Microservice Demo", ()=>{
	it("Start Service", (done)=>{
    server.start(()=>{
      const newSession = new Session({id : '4ed8c51d-0e4f-4180-b557-35a1df79cbaa'});
      newSession.questionnaire.push('5a4b1b59af7001a735b50c80');
      newSession.save(err=>{
        return done();
      });
    });
  });
});
