const mockData = require('../mock/newReleases');
const axios = require('axios-https-proxy-fix');
const get = require('lodash/get');
const formatCurrency = require('format-currency');
const moment = require('moment');


// TODO: make it readable
const URL = 'https://api.nike.com/product_feed/threads/v2/?anchor=0&count=8&filter=marketplace%28JP%29&filter=language%28ja%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom';

module.exports = function fetchNewReleases() {
  return new Promise(async (resolve) => {

    try {
      const response = await axios.get(URL);
      const opts = {
        format: '%s%v',
        symbol: '¥',
        locale: 'ja-JP',
      };

      // TODO: make it cleaner
      const payload = response.data.objects.map(item => ({
        image: get(item, 'publishedContent.properties.coverCard.properties.squarishURL'),
        date: moment(get(item, 'productInfo[0].merchProduct.commerceStartDate')).local().format('MM/DD/YYYY hh:mm'),
        name: get(item, 'publishedContent.nodes[0].properties.title'),
        // for some reason, it this API right SKU is called styleColor
        sku: get(item, 'productInfo[0].merchProduct.styleColor'),
        price: formatCurrency(get(item, 'productInfo[0].merchPrice.currentPrice'), opts),
        id: item.id,
      }));

      resolve(payload);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  // TODO: @Nazar, I'd like to keep code below here inplace
  //     return new Promise(async (resolve) => {
  // 	let mockData = [];
  // 	// P.runScenario(() => {
  // 	//     console.log('hello from test')
  // 	// })
  // 	let browser;
  // 	try {
  // 	    browser = await puppeteer.launch({
  // 		headless: true,
  // 		slowMo: 0});
  // 	    const page = await browser.newPage();
  // 	    await page.goto('https://nike.com/jp/launch');
  // 	    mockData.concat(await page.evaluate(
  // 		() => Array.prototype.slice.call(document.querySelectorAll('figure'))
  // 		    .map((item) => {
  // 			return {
  // 			    image: item.querySelector('img').src,
  // 			    name: item.attributes["aria-label"],
  // 			    href: item.querySelector('a').href
  // 			};
  // 		    })));
  // 	}catch(e){
  // 	    console.error(e);
  // 	}
  // 	finally{
  // 	    resolve(mockData);
  // 	    browser.close();
  // 	}
  //     });
<<<<<<< HEAD
};
=======
}
>>>>>>> b7bb42e5244804de37228e04b0373c5d966c6900

