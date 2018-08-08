const chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

chai.use(chaiAsPromised);

describe('Puppeteer testing suite', () => {
  describe('Scenario',  () => {
    it('Should properly load and execute set of scenarios', async (done) => {
	    const injector = async (options, page) => {
          expect(page).is.is.an('object');
          expect(options).is.is.an('object');
          expect(options).has.property('account').is.an('object');
          expect(options).has.property('proxy').is.an('object');
          //expect(options).has.property('order').is.an('object');
        }
        , runScenario = require('./runScenario');
      const login = require('./scenario/login'),
        logout = require('./scenario/logout'),
        purchase = require('./scenario/purchase');

	    runScenario([login, injector,  purchase, logout]);
      done();
    }, 30000);
  });
});

