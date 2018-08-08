const chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should()
  , main = require('./newReleases');

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
