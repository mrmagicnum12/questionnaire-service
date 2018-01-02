const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const createSessionId =  require('../lib/sessionIdCreator');
const server = require('../server');
const _questionnaireId='5a4b1b59af7001a735b50c80'
let _sessionId;

chai.should();
chai.use(chaiHttp);


describe("/summary", ()=>{
  beforeEach((done) => {
    createSessionId.create((error, sessionId)=>{
      _sessionId = sessionId;
      done();
    });
  });

  it("Call Summary API", (done)=>{
    chai.request('http://localhost:4000')
    .get('/summary')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '4ed8c51d-0e4f-4180-b557-35a1df79cbaa')
    .end((req, res)=>{
      expect(res).to.have.status(200);
      expect(typeof res.body).to.equal('object');
      expect(typeof res.body.summary).to.equal('object');
      done();
    });
  });

  it("Call Summary API With invalid Session ID", (done)=>{
    chai.request('http://localhost:4000')
    .get('/summary')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', '323233')
    .end((req, res)=>{
      expect(res).to.have.status(401);
      expect(typeof res.body).to.equal('object');
      expect(typeof res.body.message).to.equal('string');
      done();
    });
  });

});
