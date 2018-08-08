const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const main = require('./newReleases');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

chai.use(chaiAsPromised);


describe('Puppeteer testing suite', () => {
  describe('Scenario',  () => {
    it('Should properly load scenario', async () => {
      const releases = await main();

      expect(releases).to.be.an('array');
      expect(releases).to.have.property('length').not.eql(0);
      console.log(releases);

    }, 10000);
  });
});
