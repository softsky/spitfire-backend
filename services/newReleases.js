const mockData = require('../mock/newReleases');


module.exports = function fetchNewReleases() {
  return new Promise((resolve) => {
    resolve(mockData);
  });
}

