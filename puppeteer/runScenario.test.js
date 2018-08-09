/*eslint no-unused-vars: "off"*/
const chai = require('chai');
const expect = chai.expect;

/*eslint no-undef: "off"*/
describe('Puppeteer testing suite', () => {
  const { runScenarios, initProxies } = require('./runScenario');

  describe('Single Scenario',  () => {
    it('Should properly load and execute single login scenario', async function(done) {
      const injector = async (options, env) => {
        const { page, logger } = env;
        expect(options).is.an('object');
        expect(env).is.an('object');
        expect(options).has.property('account').is.an('object');
        expect(options).has.property('proxy').is.an('object');
        expect(env).has.property('page').is.an('object');
        expect(env).has.property('logger').is.an('object');
      };
      const login = require('./scenario/login');

      runScenarios([login, injector]);
      done();
    }, 30000)

  });

  // describe('Multiple Scenarios',  () => {
  //   it('Should properly load and execute set of scenarios', async (done) => {
  //     const injector = async (options) => {
  //       expect(options).is.an('object');
  //       expect(options).has.property('account').is.an('object');
  //       expect(options).has.property('proxy').is.an('object');
  //       //expect(options).has.property('page').is.an('object');
  //       //expect(options).has.property('order').is.an('object');
  //     };
  //     const login = require('./scenario/login');
  //     const logout = require('./scenario/logout');
  //     const purchase = require('./scenario/purchase');

  //     runScenarios([login, injector,  purchase, logout], (await initProxies()).pop());
  //     done();
  //   }, 30000);
  // });

});
