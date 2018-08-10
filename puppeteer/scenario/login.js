module.exports = async (options, env) => {
  const { account } = options;
  const { page, logger } = env;

  try {
    await page.waitForSelector('button[data-qa="mobile-nav-menu-button"]');
    await page.click('button[data-qa="mobile-nav-menu-button"]');
    await page.waitForSelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
    await page.click('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', account.username);
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', account.password);
    await page.click('input[type="button"][value="ログイン"]');
    await page.waitForSelector('img[data-qa="portrait-img"]');
  }catch(e){
    logger.error(e);
  }
};
