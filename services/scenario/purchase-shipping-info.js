module.exports = async (options, env) => {
  const { account, order } = options;
  const { page, logger } = env;

  logger.info('Purchase script started');
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
