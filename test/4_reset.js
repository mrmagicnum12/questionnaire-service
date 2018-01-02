'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const models = require('questionnaire-models');
const Session = models.Session;

describe("Removing Questionnaire Microservice Demo Data", ()=>{
	it("Remove Test Data", (done)=>{
    Session.remove({}, err=>{
      return done();
    });
  });
});
