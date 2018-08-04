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
    	browser = await puppeteer.launch({headless: true, args: ['–no-sandbox',
								 '–disable-setuid-sandbox']});
    });

    afterAll(async () => await browser.close());

    describe('Puppeteer', () => {
	it('Should succesfully run puppeteer on execution environment', async () => {
	    return browser.newPage();
        });
    })
})
