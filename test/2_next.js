const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const createSessionId =  require('../lib/sessionIdCreator');
const server = require('../server');
const _questionnaireId='5a4b1b59af7001a735b50c80'
let _sessionId;

chai.should();
chai.use(chaiHttp);


describe("/next", ()=>{
  beforeEach((done) => {
    createSessionId.create((error, sessionId)=>{
      _sessionId = sessionId;
      done();
    });
  });

  it("Call The Next After the First API", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .send({ answerId: '5a4b1bbdaf7001a735b50c89', questionId: '5a4b1bbdaf7001a735b50c83' })
    .end((req, res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });

  it("Call Next API With invalid Session ID", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '333343')
    .send({ answerId: '5a4b1bbdaf7001a735b50c89', questionId: '5a4b1bbdaf7001a735b50c83' })
    .end((req, res)=>{
      expect(res).to.have.status(401);
      done();
    });
  });

  it("Call Next API With invalid Session ID", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '123')
    .send({ answerId: '5a4b1bbdaf7001a735b50c89', questionId: '5a4b1bbdaf7001a735b50c83' })
    .end((req, res)=>{
      expect(res).to.have.status(401);
      done();
    });
  });

  it("Call Next with Answer to Questionnaire", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .send({ answerId: '5a4b1bbdaf7001a735b50c89', questionId: '5a4b1bbdaf7001a735b50c83' })
    .end((req, res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });

  it("Call Next with Next Answer to Questionnaire", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .send({ answerId: '5a4b1bbdaf7001a735b50489', questionId: '5a4bc1adaf7001a735b50ca4' })
    .end((req, res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });

  it("Call Next with Final Answer to Questionnaire", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .send({ answerId: '5a4b1bbdaf7101a735b50489', questionId: '5a4bd0a7af7001a735b50cc1' })
    .end((req, res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });

  it("Call Next with No More Questions to Questionnaire", (done)=>{
    chai.request('http://localhost:4000')
    .post('/next')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .send({ answerId: '5a4b1bbdaf7001a735b50c89', questionId: '5a4b1bbdaf7001a735b50c83' })
    .end((req, res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });
});
