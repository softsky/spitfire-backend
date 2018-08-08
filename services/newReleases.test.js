<<<<<<< HEAD
const chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should()
  , main = require('./newReleases');
=======
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const main = require('./newReleases');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
>>>>>>> b7bb42e5244804de37228e04b0373c5d966c6900

chai.use(chaiAsPromised);

describe('Puppeteer testing suite', () => {
<<<<<<< HEAD
    describe('Scenario',  () => {
        it('Should properly load scenario', async () => {
	    const releases = await main();
=======
  describe('Scenario',  () => {
    it('Should properly load scenario', async () => {
      const releases = await main();
>>>>>>> b7bb42e5244804de37228e04b0373c5d966c6900

      expect(releases).to.be.an('array');
      expect(releases).to.have.property('length').not.eql(0);
      console.log(releases);

<<<<<<< HEAD
        }, 10000);
    });
=======
    }, 10000);
  });
>>>>>>> b7bb42e5244804de37228e04b0373c5d966c6900
});
