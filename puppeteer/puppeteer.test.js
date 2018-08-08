/*eslint no-unused-vars: "off"*/
const chai = require('chai');
const puppeteer = require('puppeteer');
/*global describe it beforeAll afterAll*/
/*eslint no-undef: "off"*/
describe('Puppeteer testing suite', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true, args: ['–no-sandbox', '–disable-setuid-sandbox'] });
  });

  afterAll(async () => await browser.close());

  describe('Puppeteer', () => {
    it('Should succesfully run puppeteer on execution environment', async () => {
      return browser.newPage();
    });
  });
});

