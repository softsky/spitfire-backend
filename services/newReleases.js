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
        date: '6/15/2018 10:00:00 AM',
        date: moment(get(item, 'productInfo[0].merchProduct.commerceStartDate')).format('MM/DD/YYYY hh:mm'),
        name: get(item, 'publishedContent.nodes[0].properties.title'),
        sku: get(item, 'productInfo[0].skus[0].catalogSkuId'),
        price: formatCurrency(get(item, 'productInfo[0].merchPrice.currentPrice'), opts),
        id: item.id,
      }));

      resolve(payload);
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
}

