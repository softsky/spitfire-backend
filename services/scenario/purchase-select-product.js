module.exports = async (options, env) => {
  const { order } = options;
  const { page, logger } = env;

  logger.debug('Purchase SelectProduct script started');

  await page.goto('https://www.nike.com/jp/launch/', {
    waitUntil: ['domcontentloaded', 'networkidle2'],
  });

  const elementSelector = `//a[contains(@aria-label, "${order.sku}")]`;
  await page.waitForXPath(elementSelector, { timeout: 1000 });
  const [el] = await page.$x(elementSelector);
  await el.click();
  await page.waitForSelector('.size-grid-dropdown.size-dropdown-button-css');

  await page.click('.size-grid-dropdown.size-dropdown-button-css');
  await page.waitForSelector('.size-grid-dropdown.size-grid-button');
  const size_buttons = await page.$('.size-grid-dropdown.size-grid-button');// ie options.order.show_size
  Array.from(size_buttons).filter(it => it.textContent === 'JP 25')[0].click();
  //await page.click('button.size-grid-dropdown.size-grid-button[]'); // ie options.order.show_size
  await page.waitForSelector('button[data-qa="add-to-jcart"]')
    .then(it => it.click());
  await page.waitFor('.cart-link');
  await page.click('.cart-link');
  await page.waitFor(3000);

  logger.debug('Purchase SelectProduct script ended');

};
