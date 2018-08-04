module.exports = async (options, page) => {

  await page.goto('https://www.nike.com/jp/launch/t/air-max-90-1-white-neutral-grey-black/'); // ie options.order
  await page.click('.size-grid-dropdown.size-dropdown-button-css');
  await page.click('.expanded li:nth-child(1)');
  await page.click('.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width');
  await page.waitFor('.cart-link');
  await page.click('.cart-link');

};
