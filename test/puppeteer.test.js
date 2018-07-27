const chai = require('chai')
, chaiAsPromised = require('chai-as-promised')
, assert = chai.assert
, expect = chai.expect
, should = chai.should();

chai.use(chaiAsPromised);

const Promise = require('bluebird')
, puppeteer = require('puppeteer');

describe('Puppeteer testing suite', () => {
    let browser;

    beforeAll(async () => {
    	browser = await puppeteer.launch({headnless: true});
    });

    afterAll(async () => await browser.close());

    describe('Puppeteer', () => {
	it('Should succesfully run puppeteer on execution environment', async () => {
	    const browser = await require('puppeteer').launch({headnless: true})
	    const page = await browser.newPage();
	    await browser.close();

	    return browser;
        });
    })

    describe('Scenario',  () => {
	it('Should properly load scenario', async () => {
	    // const login = require('./scenarios/login')
	    // , logout = require('./scenarios/login')
	    // runScenario([login, logout])	    
	});
    })
})
 
