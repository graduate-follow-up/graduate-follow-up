const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

function createLog(logType) {
  return {
    'logType': logType,
    'actorId': '5ebbfc1afc13ae528150006f',
    'actorRole': 'admin',
    'subjectId': '5ebbfc1afc1sssssss00006f',
    'description': 'Hello'
  }
};

const alumniLogTypes = ['AlumniCreated', 'AlumniModified', 'AlumniDeleted'];

describe('service_logs', () => {

  describe('POST /', () => {

    let logTypes = ['UpdateMailSent', 'AlumniCreated','AlumniModified','AlumniDeleted', 'UserCreated','UserModified','UserDeleted','LoggedIn','TokenRefreshed','LoggedOut']

    logTypes.forEach(logType => {
      it(`should add an ${logType} log when using service\'s token`, async () => {
        let res = await axios.asService('connexion').post('/logs/', createLog(logType));
        res.status.should.equal(204);
      });
    });

    it('should not insert an UndefinedLog using service\'s token', async () => {
      try {
        await axios.asService('connexion').post('/logs/', createLog('UndefinedLog'));
      } catch(error) {
        error.response.status.should.equal(400);
        return;
      }

      assert.fail('did not failed');
    });

    it('should not work when using an admin token', async () => {
      try {
        await axios.asAdmin.post('/logs/', createLog('AlumniModified'));
      } catch (error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
  
  describe('GET /', () => {
    it('should not return anything as user', async () => {
      try {
        await axios.asUser.get('/logs');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it('should return a list when querying as admin', async () => {
      let res = await axios.asAdmin.get('/logs');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(log => {
        log.should.include.all.keys('id','date','logType','actorRole','actorId');
      });
    });

    it('should return only alumnis events when querying as respo', async () => {
      let res = await axios.asRespo.get('/logs');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(log => {
        log.should.include.all.keys('id','date','logType','actorRole','actorId');
        log.logType.should.satisfy(type => alumniLogTypes.includes(type));
      });
    });
  });

  describe('GET /page/:pageId', () => {
    it('should not return anything as user', async () => {
      try {
        await axios.asUser.get('/logs');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it('should not work with pageId = 0', async () => {
      try {
        await axios.asAdmin.get('/logs/page/0');
      } catch(error) {
        error.response.status.should.equal(400);
        return;
      }

      assert.fail('did not failed');
    });

    
    it('should not work with negtive pageId', async () => {
      try {
        await axios.asAdmin.get('/logs/page/-5');
      } catch(error) {
        error.response.status.should.equal(400);
        return;
      }

      assert.fail('did not failed');
    });

    it('should return a list when querying as admin', async () => {
      let res = await axios.asAdmin.get('/logs/page/1');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(log => {
        log.should.include.all.keys('id','date','logType','actorRole','actorId');
      });
    });

    it('should return only alumnis events when querying as respo', async () => {
      let res = await axios.asRespo.get('/logs/page/1');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(log => {
        log.should.include.all.keys('id','date','logType','actorRole','actorId');
        log.logType.should.satisfy(type => alumniLogTypes.includes(type));
      });
    });
  });
});