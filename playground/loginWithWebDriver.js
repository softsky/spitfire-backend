const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const { until, By } = require('selenium-webdriver');


async function waitForTitle() {
  // TODO: compare selenium-webdriver vs puppeteer and choose the best one 
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto('https://www.nike.com/jp/launch/');
  // const title = await page.title();
<<<<<<< Updated upstream
=======
  
  const chromeCapabilities = webdriver.Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {args: ['--headless']});

  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

  try {
    // Navigate to google.com, enter a search.
    await driver.get('https://www.nike.com/jp/launch/')
    console.log('loaded');

    // Wait until a title contais SNKRS
    await driver.wait(until.titleContains('SNKRS'), 10000);
    console.log('title contains SNKRS');

    driver.quit();
  } catch(error) {
    console.log(error);
  }
>>>>>>> Stashed changes
}



