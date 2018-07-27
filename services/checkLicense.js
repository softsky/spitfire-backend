function rand(items) {
  return items[~~(items.length * Math.random())];
}

module.exports = function checkLicense() {
  return new Promise((resolve, reject) => {
    const statusCodes = [200, 400];
    const code = rand(statusCodes);

    if (code === 200) {
      const payload = {
        status: code,
        payload: {}, // proxies
      };
      
      resolve(payload);
    } else {
      reject(code);
    }
  });
}

