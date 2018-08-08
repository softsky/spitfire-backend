const mockData = {
  'ip': '138.130.230.29',
  'country': 'UA',
  'geoip': 740363905,
  'asn': {
    'asnum': 56233,
    'org_name': 'Local Net',
  },
  'geo': {
    'city': 'Kiev',
    'region': '30',
    'postal_code': '04212',
    'latitude': 50.4333,
    'longitude': 30.5167,
    'tz': 'Europe/Kiev',
  },
};

function rand(items) {
  return items[~~(items.length * Math.random())];
}

module.exports = function testProxy() {
  return new Promise((resolve, reject) => {
    const statusCodes = [200, 407, 408];
    const code = rand(statusCodes);

    if (code === 200) {
      const payload = {
        status: code,
        payload: mockData,
      };

      resolve(payload);
    } else {
      reject(code);
    }
  });
};

