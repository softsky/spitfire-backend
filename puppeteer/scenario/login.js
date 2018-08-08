module.exports = async (options, page) => {
  const sleep = seconds =>
    new Promise(resolve => setTimeout(resolve, (seconds || 1) * 1000));
  await page.click('button[data-qa="mobile-nav-menu-button"]');
  const btn = await page.waitForSelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button', { timeout: 2000, visible:true });
  await page.click('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', options.account.username);
  await page.waitForSelector('input[type="password"]');
  await page.type('input[type="password"]', options.account.password);
  await page.click('input[type="button"][value="ログイン"]');
  //sleep(5);
  //await page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle2']});
};
