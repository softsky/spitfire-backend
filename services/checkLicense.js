const axios = require('axios-https-proxy-fix');


const KEYGEN_ACCOUNT_ID = '67608f49-9d1a-4ca3-b84f-04ae8e2aeab7';
const KEYGEN_PRODUCT_ID = 'dd8ca258-98b2-4779-a186-16eedcc2b37a';
const URL = `https://api.keygen.sh/v1/accounts/${KEYGEN_ACCOUNT_ID}/licenses/actions/validate-key`;

module.exports = function checkLicense(key) {
  const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  };

  const payload = {
    meta: {
      scope: { product: KEYGEN_PRODUCT_ID },
      key,
    },
  };

  const request = axios.create({ headers });
  return request.post(URL, payload);
};

