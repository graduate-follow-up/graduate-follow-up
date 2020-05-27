const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

const newUser = {
  "login": "magna",
  "password": "eiusmod",
  "role": "prof",
  "name": {
      "first": "Lindsay",
      "last": "Lohan"
  },
  "email": "dodson.byers@undefined.io"
};

let testRunDate = Date.now()

describe('service_user', () => {
  describe('GET /', () => {
    it('should not return anything as user', async () => {
      try {
        await axios.asUser.get('/users');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });

    it('should return a list when querying as admin', async () => {
      let res = await axios.asAdmin.get('/users');
      res.status.should.equal(200);
      res.data.should.be.an('array')
      res.data.every(alumni => alumni.should.have.all.keys("_id","email","login","name","password","role"));
    });
  });

  describe('POST /check-user', () => {
    const userToCheck = {
      "user" : "excepteur",
      "password" : "ullamco"
    };

    it('should return user infos when using connexion service\'s token', async () => {
      let res = await axios.asService('connexion').post('/users/check-user', userToCheck)
      res.status.should.equal(200);
      res.data.should.have.all.keys("_id","role");
    });

    it('should not work when using wrong token', async () => {
      try {
        await axios.asAdmin.post('/users/check-user', userToCheck)
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('GET /:userId', () => {
    const userId = "5eba68613b6d1a9069756982";
    const userId2 = "5eba6861b0b374d1e825fa68";

    it('should return an user when using an admin token', async () => {
      let res = await axios.asAdmin.get(`/users/${userId}`);
      res.status.should.equal(200);
      res.data.should.be.an('object');
      res.data.should.have.all.keys("_id","email","login","name","password","role")
    });

    it('should return an user when using self token', async () => {
      let res = await axios.asUser.get(`/users/${userId}`);
      res.status.should.equal(200);
      res.data.should.be.an('object');
      res.data.should.have.all.keys("_id","email","login","name","password","role")
    });

    it('should not work when using a lambda user token', async () => {
      try {
        await axios.asUser.get(`/users/${userId2}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('POST /', () => {
    let n = 0;
    function setNext(user) {
      user['login'] = 'login' + testRunDate + '' + n;
      user['email'] = 'lindsay.lohan@undefined.biz' + testRunDate + '' + n;
      n++;
      return user;
    }

    it('should create an user when using an admin token', async () => {
      let res = await axios.asAdmin.post('/users/', setNext(newUser));
      res.status.should.equal(200);
      res.data.should.be.an('string');
    });

    it('should not work when using a respo token', async () => {
      try {
        await axios.asRespo.post('/users/', setNext(newUser));
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }
    });
    
    it('should not work when using an user token', async () => {
      try {
        await axios.asUser.post('/users/', setNext(newUser));
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('PUT /:userId', () => {
    const userId = "5eba68613b6d1a9069756982";
    const id = "5ecd1677dcacd5bedcfc40dc";

    const modifiedUser = {...newUser};
    delete modifiedUser['role']; // We do not want to update the role

    it('should update an user when using an admin token', async () => {
      let res = await axios.asAdmin.put(`/users/${userId}`, newUser);
      res.status.should.equal(204);
    });

    it('should not update when using a user token and modifying the role property', async () => {
      try {
        await axios.asUser.put(`/users/${userId}`, newUser);
      } catch(error) {
        error.response.status.should.equal(403);
        return;
      }

      assert.fail('did not failed');
    });

    it('should update an user when using self token', async () => {
      let res = await axios.asUser.put(`/users/${userId}`, modifiedUser);
      res.status.should.equal(204);
    });

    it('should not work when using a respo token', async () => {
      try {
        await axios.asRespo.put(`/users/${id}`, newUser);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
    
    it('should not work when using a lambda user token', async () => {
      try {
        await axios.asUser.put(`/users/${id}`, newUser);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });

  describe('DELETE /:alumniId', () => {
    let ids = [];

    let n = 0;
    function setNext(user) {
      user['login'] = 'logindelete' + testRunDate + '' + n;
      user['email'] = 'lindsay.lohan@delete.biz' + testRunDate + '' + n;
      n++;
      return user;
    }

    before(async () => {

      for(let i = 0; i < 3; i++) {
        // We create an alumni
        let res = await axios.asAdmin.post('/users/', setNext(newUser));
        res.status.should.equal(200);
        res.data.should.be.an('string');
        ids.push(res.data);
      }
    });

    it('should delete an users when using an admin token', async () => {
      let res = await axios.asAdmin.delete(`/users/${ids[0]}`);
      res.status.should.equal(204);
    });

    it('should not delete a deleted users', async () => {
      try {
        await axios.asAdmin.delete(`/users/${ids[0]}`);
      } catch(error) {
        error.response.status.should.equal(404);
        return;
      }

      assert.fail('did not failed');
    });

    it('should not work when using a respo token', async () => {
      try {
        await axios.asRespo.delete(`/users/${ids[1]}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
    
    it('should not work when using a user token', async () => {
      try {
        await axios.asUser.delete(`/users/${ids[2]}`);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
});