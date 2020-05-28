const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

xdescribe('service_link', () => {
  describe('POST /send-update-mail', () => {
    let idsList = ["5ebbfc19fc13ae528a000065","5ebbfc19fc13ae528a000066","5ebbfc1afc13ae528a000067"];

    it('should send email when logged as admin', async () => {
      let res = await axios.asAdmin.post('/link/send-update-mail', idsList);
      res.status.should.equal(200);
    });

    it('should send email when logged as respo', async () => {
      let res = await axios.asRespo.post('/link/send-update-mail', idsList);
      res.status.should.equal(200);
    });

    it('should not send email when logged as user', async () => {
      try {
        await await axios.asUser.post('/link/send-update-mail', idsList);
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
});