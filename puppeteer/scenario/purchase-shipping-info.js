module.exports = async (options, env) => {
  const { account, order } = options;
  const { page, logger } = env;

  logger.info('Purchase script started');
  await page.goto('https://www.nike.com/jp/launch/t/air-max-90-1-white-neutral-grey-black/'); // ie options.order
  await page.waitFor('.size-grid-dropdown.size-dropdown-button-css');
  await page.click('.size-grid-dropdown.size-dropdown-button-css');
  await page.waitFor('.size-grid-dropdown.size-grid-button'); // ie options.order.show_size
  await page.click('.size-grid-dropdown.size-grid-button'); // ie options.order.show_size
  await page.waitFor('.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width');
  await page.click('.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width');
  await page.waitFor('.cart-link');
  await page.click('.cart-link');
  await page.waitFor(3000);
  await page.click('#ch4_cartCheckoutBtn');
  await page.waitFor('#lname');
  await page.type('#lname', order.BillingFirstName);
  await page.type('#fname', order.BillingLastName);
  await page.type('#altLastName', order.BillingAltLastName);
  await page.type('#altFirstName', order.BillingAltFirstName);
  await page.type('#altFirstName', order.BillingAltFirstName);
  await page.type('#postalCodeField', order.BillingZipCode);
  await page.click('#singleState');
  await page.select('#singleState', order.BillingStateJP);
  await page.type('#singleCity', order.BillingCity);
  await page.type('#shippingForm input[name="address1Field"]', order.ShippingAddress1);
  await page.type('#shippingForm input[name="address2Field"]', order.ShippingAddress2);
  await page.type('#shippingForm input[name="address3Field"]', order.ShippingAddress3);
  await page.click('#shippingSubmit');
  await page.waitFor(3000);
  logger.info('Purchase script ended');
};
