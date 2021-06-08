const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let test1UserID = 7
let test2UserID = 6
let token1;
let token2;

describe(`TEST 1: /POST login for userID: ${test1UserID}`, () => {
    it(`It should POST the login for userID: ${test1UserID} and return loginLogic and a token for the userID.\nThe userID should be equal to ${test1UserID} and admin status equal to false`, (done) => {
        let login = {
            email: 'test1@test.com',
            password: 'test123'
        }
      chai.request('http://localhost:7071/api')
          .post('/login')
          .send(login)
          .end((err, res,) => {
                res.should.have.status(200);
                let content = JSON.parse(res.text)
                expect(content).to.be.an('object')
                expect(content).to.have.any.keys('token')
                expect(content).to.have.any.keys('loginLogic')
                expect(content.loginLogic[0].value).to.equal(7)
                expect(content.loginLogic[1].value).to.equal(false)
                token1 = content.token
            done();
          });
    });
});

describe(`TEST 2: /POST login for userID: ${test1UserID}, but the wrong password`, () => {
    let login = {
        email: 'test1@test.com',
        password: 'test12'
    }
    it(`It should not POST the login for userID: ${test1UserID} and not return loginLogic and a token for the userID.\nReturns a string with: 'Wrong password for email: ${login.email}'`, (done) => {
      chai.request('http://localhost:7071/api')
          .post('/login')
          .send(login)
          .end((err, res,) => {
                res.should.have.status(401);
                let content = res.text
                expect(content).to.be.an('string')
                expect(content).to.deep.equal(`Wrong password for email: ${login.email}`)
            done();
          });
    });
});

describe(`TEST 3: /POST login but non existent email`, () => {
    it(`It should return 'User does not exist'`, (done) => {
        let login = {
            email: 'dethererentest@test.com',
            password: 'test123'
        }
      chai.request('http://localhost:7071/api')
          .post('/login')
          .send(login)
          .end((err, res,) => {
                res.should.have.status(400);
                let content = res.text
                expect(content).to.be.an('string')
                expect(content).to.deep.equal(`User does not exist`)
            done();
          });
    });
});

describe(`TEST 4: /GET user info for userID: ${test1UserID}, based on their token`, () => {
    it(`Should get all user info for userID: ${test1UserID}, \nchecks token for authentication, that it is an array of the length 16, with keys value and metadata`, (done) => {
      chai.request('http://localhost:7071/api')
          .get(`/tinderUserGetFullByID?id=${test1UserID}`)
          .set('token', token1)
          .end((err, res) => {
                res.should.have.status(200);
                let content = JSON.parse(res.text)
                expect(content).to.be.an('array')
                expect(content).lengthOf(16)
                expect(content[0]).to.have.keys('value', 'metadata')
            done();
        });
    });
});

describe(`TEST 5: /GET user info for userID: ${test1UserID}, but no token`, () => {
    it(`Should not allow all user info for userID: ${test1UserID} because of missing token for authentication.\nExpects a return that includes 'No user'`, (done) => {
      chai.request('http://localhost:7071/api')
          .get(`/tinderUserGetFullByID?id=${test1UserID}`)
          .end((err, res) => {
                res.should.have.status(400);
                let content = res.text
                expect(content).to.include(`No user`)
            done();
        });
    });
});

describe(`TEST 6: UserID: ${test1UserID} attempts to /GET user info for userID: ${test2UserID}, but gets their own info`, () => {
    it(`Should not allow all user info for userID: ${test2UserID}, \nbut because of the token containing userID it should return info for userID: ${test1UserID} who made the request`, (done) => {
      chai.request('http://localhost:7071/api')
          .get(`/tinderUserGetFullByID?id=${test2UserID}`)
          .set('token', token1)
          .end((err, res) => {
            res.should.have.status(200);
            let content = JSON.parse(res.text)
            expect(content).to.be.an('array')
            expect(content).lengthOf(16)
            expect(content[0]).to.have.keys('value', 'metadata')
            expect(content[0].value).to.equal(test1UserID)
            done();
        });
    });
});

describe(`TEST 7: /POST login for userID: ${test2UserID}, who is an admin`, () => {
    let login = {
        email: 'admin@admin.com',
        password: 'test123'
    }
    it(`It should POST the login for userID: ${test2UserID} and return loginLogic and a token for the userID.\nThe userID should be equal to ${test2UserID} and admin status equal to true`, (done) => {
        chai.request('http://localhost:7071/api')
        .post('/login')
        .send(login)
        .end((err, res,) => {
              res.should.have.status(200);
              let content = JSON.parse(res.text)
              expect(content).to.be.an('object')
              expect(content).to.have.any.keys('token')
              expect(content).to.have.any.keys('loginLogic')
              expect(content.loginLogic[0].value).to.equal(6)
              expect(content.loginLogic[1].value).to.equal(true)
              token2 = content.token
          done();
        });
  })
});

describe(`TEST 8: /GET user info for userID: ${test1UserID}, but it's ${test2UserID} who is an admin`, () => {
    it(`Should allow all user info for userID: ${test1UserID}, based on the token of an admin user, admin userID: ${test2UserID}.\nContent should be an array of the length 16, with keys 'value' and 'metadata', where the userID is equal to ${test1UserID}`, (done) => {
      chai.request('http://localhost:7071/api')
          .get(`/tinderUserGetFullByID?id=${test1UserID}`)
          .set('token', token2)
          .end((err, res) => {
            res.should.have.status(200);
            let content = JSON.parse(res.text)
            expect(content).to.be.an('array')
            expect(content).lengthOf(16)
            expect(content[0]).to.have.keys('value', 'metadata')
            expect(content[0].value).to.equal(test1UserID)
            done();
        });
    });
});