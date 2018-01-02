const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const createSessionId =  require('../lib/sessionIdCreator');
const server = require('../server');
const _questionnaireId='5a4b1b59af7001a735b50c80'
let _sessionId;

chai.should();
chai.use(chaiHttp);


describe("/start", ()=>{
  beforeEach((done) => {
    createSessionId.create((error, sessionId)=>{
      _sessionId = sessionId;
      done();
    });
  });

	it("Call The Start API First", (done)=>{
    chai.request('http://localhost:4000')
    .get('/start')
    .set('questionnaireId', _questionnaireId)
    .set('sessionId', _sessionId)
    .end((req, res)=>{
      expect(res).to.have.status(200);
      expect(typeof res.body).to.equal('object');
      expect(typeof res.body.question).to.equal('object');
      done();
    });
  });
});
