module.exports = async (options, env) => {
  const { account, order } = options;
  const { page, logger } = env;

  logger.info('Purchase script Payment started');
  await page.waitFor('#creditCardNumber');
  await page.type('#creditCardNumber', order.CreditCardNumber);
  await page.click('#expirationYear');
  await page.select('#expirationYear', order.CreditCardExpirityYear);
  await page.click('#expirationMonth');
  await page.select('#expirationMonth', order.CreditCardExpirityMonth);
  await page.type('#singleCity', order.BillingCity);
  await page.type('#phoneNumber', order.BillingPhone);
  await page.type('#faxNumber', order.BillingPhone); // TODO we don't have any fax
  await page.type('#email', account.username);

  await page.click('#cardFormUse');

  logger.info('Purchase script Payment ended');
};
