const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const axios = require('./axios-jwt-wrapper.js');

describe('service_stats', () => {
  describe('GET /stats/chartType/wage/option', () => {
    it('should work when logged in', async () => {
      let res = await axios.asUser.get('/stats/chartType/wage/option');
      res.status.should.equal(200);
    });

    it('should not work when logged out', async () => {
      try {
        await await axios.withoutToken.get('/stats/chartType/wage/option');
      } catch(error) {
        error.response.status.should.equal(401);
        return;
      }

      assert.fail('did not failed');
    });
  });
});