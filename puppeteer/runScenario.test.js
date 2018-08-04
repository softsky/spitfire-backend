const chai = require('chai')
, chaiAsPromised = require('chai-as-promised')
, assert = chai.assert
, expect = chai.expect
, should = chai.should();

chai.use(chaiAsPromised);

describe('Puppeteer testing suite', () => {
    describe('Scenario',  () => {
	it('Should properly load scenario', async () => {
	    const testInjector = async (options, page) => {
                expect(page).is.of.type('object');
                expect(options).is.of.type('object');
                expect(options).has.property('account').of.type('object');
                expect(options).has.property('proxy').of.type('object');
            }
            , runScenario = require('./runScenario');
            const login = require('./scenario/login'),
                  logout = require('./scenario/logout');
            
	    return runScenario([login, test, logout]);
	}, 20000);
    })
})

