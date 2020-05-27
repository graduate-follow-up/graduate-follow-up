const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

const credentials = {
  admin: {
    "user": "sint",
    "password": "aute"
  },
  respo: {
    "user": "excepteur",
    "password": "ullamco",
  },
  prof: {
    "user": "magna",
    "password": "eiusmod",
  },
  wrong: {
    "user": "aaaaa",
    "password": "aaaaa",
  }
}

describe('service_connexion', () => {

  let tokens = {
    admin: null,
    prof: null,
    respo: null
  }

  describe('POST /login', () => {
    it('should login as administrator', async () => {
      let res = await axios.withoutToken.post('/connexion/login', credentials.admin);
      res.status.should.equal(200);
      res.data.should.have.property('accessToken');
      res.data.should.have.property('refreshToken');

      tokens.admin = res.data;
    });

    it('should login as prof', async () => {
      let res = await axios.withoutToken.post('/connexion/login', credentials.prof);
      res.status.should.equal(200);
      res.data.should.have.property('accessToken');
      res.data.should.have.property('refreshToken');
      
      tokens.prof = res.data;
    });

    it('should login as respo', async () => {
      let res = await axios.withoutToken.post('/connexion/login', credentials.respo);
      res.status.should.equal(200);
      res.data.should.have.property('accessToken');
      res.data.should.have.property('refreshToken');

      tokens.respo = res.data;
    });

    it('should not login with wrong credentials', async () => {
      try {
        await axios.withoutToken.post('/connexion/login', credentials.wrong);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('POST /logout', () => {
    it('should logout', async () => {
      let res = await axios.withoutToken.post('/connexion/logout', { token : tokens.respo.refreshToken });
      res.status.should.equal(200);
      res.data.should.equal('Logout successful');
    });
  });

  describe('POST /token', () => {
    it('should refresh the token', async () => {
      let res = await axios.withoutToken.post('/connexion/token', { token : tokens.admin.refreshToken });
      res.status.should.equal(200);
      res.data.should.have.property('accessToken');
    });

    it('should not refresh the disconnected token', async () => {
      try {
        await axios.withoutToken.post('/connexion/token', { token : tokens.respo.refreshToken });
      } catch(error) {
        error.response.status.should.equal(403);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('GET /alumni-token/:ids', () => {
    const ids = '5ebbfc19fc13ae528a000065,5ebbfc19fc13ae528a000066';

    it('should return signed tokens when using link service\'s token', async () => {
      let res = await axios.asService('link').get(`/connexion/alumni-token/${ids}`);
      res.status.should.equal(200);
      res.data.should.have.property('5ebbfc19fc13ae528a000065');
      res.data.should.have.property('5ebbfc19fc13ae528a000066');
    });

    it('should not work when using wrong token', async () => {
      try {
        await axios.asAdmin.get(`/connexion/alumni-token/${ids}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it('should not work when not using token', async () => {
      try {
        await axios.withoutToken.get(`/connexion/alumni-token/${ids}`, { token : tokens.admin.refreshToken });
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
});