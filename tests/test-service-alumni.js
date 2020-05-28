const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

const newAlumni = {
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@eisti.eu",
  "company": "Flashspan",
  "job": "Web Designer UX",
  "country": "France",
  "city": "Lille",
  "option": "BI",
  "campus": "Pau",
  "graduation": 1997,
  "wage": 72,
  "phone": "0600000000"
}

describe('service_alumni', () => {
  describe('GET /', () => {
    it('should not return anything without token', async () => {
      try {
        await axios.withoutToken.get('/alumnis');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it('should return a list when querying as admin', async () => {
      let res = await axios.asAdmin.get('/alumnis/');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(alumni => alumni.should.have.all.keys("_id","campus","city","company","country","email","first_name","graduation","job","last_name","option","phone","wage"));
    });

    it('should return an anonymized list when querying as user', async () => {
      let res = await axios.asUser.get('/alumnis/');
      res.status.should.equal(200);
      res.data.should.be.an('array');
      res.data.every(alumni => alumni.should.have.all.keys("_id","campus","city","company","country","graduation","job","option","wage"));
    });
  });

  describe('GET /infos/:ids', () => {
    const ids = '5ebbfc19fc13ae528a000065,5ebbfc19fc13ae528a000066';

    it('should return alumni infos when using link service\'s token', async () => {
      let res = await axios.asService('link').get(`/alumnis/infos/${ids}`);
      res.status.should.equal(200);
      res.data.should.be.an('array');
      res.data.every(alumni => alumni.should.have.all.keys("_id","first_name","last_name","email"));
    });

    it('should not work when using wrong token', async () => {
      try {
        await axios.asAdmin.get(`/alumnis/infos/${ids}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('GET /:alumniId', () => {
    const id = "5ebbfc1afc13ae528a000069";

    it('should return an alumni when using an admin token', async () => {
      let res = await axios.asAdmin.get(`/alumnis/${id}`);
      res.status.should.equal(200);
      res.data.should.be.an('object');
      res.data.should.have.all.keys("_id","campus","city","company","country","email","first_name","graduation","job","last_name","option","phone","wage")
    });

    it('should return an alumni anonymized data when using a user token', async () => {
      let res = await axios.asUser.get(`/alumnis/${id}`);
      res.status.should.equal(200);
      res.data.should.be.an('object');
      res.data.should.have.all.keys("_id","campus","city","company","country","graduation","job","option","wage")
    });

    it('should not work when using a service token', async () => {
      try {
        await axios.asService('link').get(`/alumnis/${id}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('POST /', () => {
    it('should create an alumni when using an admin token', async () => {
      let res = await axios.asAdmin.post('/alumnis/', newAlumni);
      res.status.should.equal(200);
      res.data.should.be.an('string');
    });

    it('should create an alumni when using a respo token', async () => {
      let res = await axios.asRespo.post('/alumnis/', newAlumni);
      res.status.should.equal(200);
      res.data.should.be.an('string');
    });
    
    it('should not work when using an user token', async () => {
      try {
        await axios.asUser.post('/alumnis/', newAlumni);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('PUT /:alumniId', () => {
    const id = "5ebbfc1afc13ae528a000069";

    it('should update an alumni when using an admin token', async () => {
      let res = await axios.asAdmin.put(`/alumnis/${id}`, newAlumni);
      res.status.should.equal(204);
      res.data.should.be.an('string');
    });

    it('should update an alumni when using a respo token', async () => {
      let res = await axios.asRespo.put(`/alumnis/${id}`, newAlumni);
      res.status.should.equal(204);
      res.data.should.be.an('string');
    });
    
    it('should not work when using a lambda user token', async () => {
      try {
        await axios.asUser.put(`/alumnis/${id}`, newAlumni);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it.skip('should update an alumni when using the same user', async () => {
      
    });
  });

  describe('DELETE /:alumniId', () => {
    let ids = [];

    before(async () => {

      for(let i = 0; i < 3; i++) {
        // We create an alumni
        let res = await axios.asAdmin.post('/alumnis/', newAlumni);
        res.status.should.equal(200);
        res.data.should.be.an('string');
        ids.push(res.data);
      }
    });

    it('should delete an alumni when using an admin token', async () => {
      let res = await axios.asAdmin.delete(`/alumnis/${ids[0]}`);
      res.status.should.equal(204);
    });

    it('should not delete a deleted alumni', async () => {
      try {
        await axios.asAdmin.delete(`/alumnis/${ids[0]}`);
      } catch(error) {
        error.response.status.should.equal(404);
        return;
      }

      assert.fail('did not failed');
    });

    it('should delete an alumni when using a respo token', async () => {
      let res = await axios.asRespo.delete(`/alumnis/${ids[1]}`);
      res.status.should.equal(204);
    });
    
    it('should not work when using a user token', async () => {
      try {
        await axios.asUser.delete(`/alumnis/${ids[2]}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('GET /schema', () => {

    it('should get a schema when using an token', async () => {
      let res = await axios.asUser.get('/alumnis/schema');
      res.status.should.equal(200);
      res.data.should.be.an('object');
    });

    it('should not get a schema without a token', async () => {
      try {
        await axios.withoutToken.get('/alumnis/schema');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
});