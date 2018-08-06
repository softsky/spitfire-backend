module.exports = async (options, page) => {

  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('./account_details.json', 'utf8'))[0];

  await page.goto('https://www.nike.com/jp/launch/t/air-max-90-1-white-neutral-grey-black/'); // ie options.order
  await page.waitFor('.size-grid-dropdown.size-dropdown-button-css');
  await page.click('.size-grid-dropdown.size-dropdown-button-css');
  await page.waitFor('.size-grid-dropdown.size-grid-button'); // ie options.order.show_size
  await page.click('.size-grid-dropdown.size-grid-button'); // ie options.order.show_size
  await page.click('.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width');
  await page.waitFor('.cart-link');
  await page.click('.cart-link');
  await page.waitFor(3000);
  await page.click('#ch4_cartCheckoutBtn');
  await page.waitFor('#lname');
  await page.type('#lname', obj.BillingFirstName)
  await page.type('#fname', obj.BillingLastName)
  await page.type('#altLastName', obj.BillingAltLastName)
  await page.type('#altFirstName', obj.BillingAltFirstName)
  await page.type('#altFirstName', obj.BillingAltFirstName)
  // await page.type('#postalCodeField', obj.BillingAddress1)
  await page.type('#postalCodeField', obj.BillingZipCode)
  await page.click('#singleState')
  await page.select('#telCountryInput', obj.BillingStateJP)
  await page.type('#singleCity', obj.BillingCity)
  await page.type('#shippingForm > div > div.singleAddress > div:nth-child(9) > div.ch4_formLabel', obj.ShippingAddress1)
  await page.type('#shippingForm > div > div.singleAddress > div:nth-child(10) > div.ch4_formField > input', obj.ShippingAddress2) 
  await page.type('#shippingForm > div > div.singleAddress > div:nth-child(11) > div.ch4_formField > input', obj.ShippingAddress3) 
  await page.click('#shippingSubmit') 
};
