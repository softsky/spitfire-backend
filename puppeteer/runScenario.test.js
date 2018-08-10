/*eslint no-unused-vars: "off"*/
const chai = require('chai');
const expect = chai.expect;

/*eslint no-undef: "off"*/
describe('Puppeteer testing suite', () => {
  const { runScenarios, initProxies } = require('./runScenario');

  // describe('Single Scenario',  () => {
  //   it('Should properly load and execute single login scenario', async () => {
  //     const injector = async (options, env) => {
  //       const { page, logger } = env;
  //       expect(options).is.an('object');
  //       expect(env).is.an('object');
  //       expect(options).has.property('account').is.an('object');
  //       expect(options).has.property('proxy').is.an('object');
  //       expect(env).has.property('page').is.an('object');
  //       expect(env).has.property('logger').is.an('object');
  //       page.waitForSelector('img[data-qa="portrait-img"]', { timeout: 100 }); // should already be here

  //     };
  //     const login = require('./scenario/login');

  //     return runScenarios([login, injector]);
  //   }, 30000);
  // });

  describe('Multiple Scenarios',  () => {
    it('Should properly load and execute set of scenarios', async () => {
      const injector = async (options, env) => {
        const { page, logger } = env;
        expect(options).is.an('object');
        expect(options).has.property('account').is.an('object');
        expect(options).has.property('proxy').is.an('object');
        expect(options).has.property('order').is.an('object');
        expect(env).has.property('page').is.an('object');
        expect(env).has.property('logger').is.an('object');
      };
      const login = require('./scenario/login');
      const logout = require('./scenario/logout');
      const purchase_shipping = require('./scenario/purchase-shipping-info');
      const purchase_payment = require('./scenario/purchase-payment-info');
      const order =  {
        'Name': 'shunya',
        'BillingFirstName': 'NAME',
        'BillingAltFirstName': 'FURIGANA',
        'BillingLastName': 'F NAME',
        'BillingAltLastName': 'F FURIGANA',
        'BillingAddress1': '緑区２－１１%num1%-%num3%',
        'BillingAddress2': '%CHAR1%棟',
        'BillingAddress3': '町屋',
        'BillingZipCode': '252-0101',
        'BillingPhone': '080%num8%',
        'BillingCity': '相模原市',
        'BillingState': '',
        'BillingStateJP': 'JP-03',
        'ShippingFirstName': 'NAME',
        'ShippingAltFirstName': 'FURIGANA',
        'ShippingLastName': 'F NAME',
        'ShippingAltLastName': 'F FURIGANA',
        'ShippingAddress1': '緑区2',
        'ShippingAddress2': '棟',
        'ShippingAddress3': '町屋',
        'ShippingZipCode': '252-0101',
        'ShippingPhone': '080%num8%',
        'ShippingCity': '相模原市',
        'ShippingState': '',
        'ShippingStateJP': 'JP-03',
        'CreditCardType': 'Visa',
        'CreditCardNumber': '4790794040508750',
        'CreditCardExpiryMonth': '06',
        'CreditCardExpiryYear': '2022',
        'CreditCardCvv': '899',
        'ShippingAddressSame': true,
        'MaxCheckouts': 0,
      };
      // Issuing network:
      // Visa
      // Card number:
      // 4790794040508750
      // Name:
      // Mia White
      // Adress:
      // Orchard Avenue 60
      // Country:
      // Greenland
      // CVV:
      // 899
      // Exp:
      // 06/2020
      return runScenarios([login, injector,  purchase_shipping, purchase_payment, logout], { order });
    }, 60000);
  });

});
