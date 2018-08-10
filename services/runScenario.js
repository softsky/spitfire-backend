const proxyChain = require('proxy-chain');
const csv = require('csv');
const async = require('async');
const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

const paPairs = [];
const accounts = [];
const proxies = [];
const numSeries = 1;


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const initProxies = async () => {

  // if already filled, return
  if(paPairs.length){
    return paPairs;
  }

  const stream = require('stream');
  const util = require('util');
  const fs = require('fs');

  const pipeline = util.promisify(stream.pipeline);

  const accountPath = __dirname + '/../accounts.csv';
  const proxyPath = __dirname + '/../proxies.csv';
  const accountStream = fs.createReadStream(accountPath);
  const proxyStream = fs.createReadStream(proxyPath);

  // FIXME:
  await pipeline(
    proxyStream,
    csv.parse({ delimiter: ':' }),
    csv.transform((record) => {
      const proxy = {
        ip: record[0],
        port: record[1],
        user: record[2],
        pwd: record[3],
      };
      proxies.push(proxy);
    }));

  await pipeline(
    accountStream,
    csv.parse({ delimiter: ':' }),
    csv.transform((record) => {
      proxies.unshift(proxies.pop());
      const username = record[0];
      const password = record[1];
      const account = { username, password };
      const proxy = proxies[0];
      accounts.push(account);

      paPairs.push({ proxy, account });
    }));

  // shuffling our array of pairs
  shuffle(paPairs); // TODO: uncomment that

  return paPairs;
};

const runScenarios = async (scenarioFunctionArray, options) => {
  const paPairs = await initProxies(); // we should make sure our proxies are loaded

  const obj = paPairs.shift();
  Object.assign(obj, options);
  const { proxy, account } = obj;

  const oldProxyUrl = `http://${proxy.user}:${proxy.pwd}@${proxy.ip}:${proxy.port}`;
  const proxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
  //require('events').EventEmitter.prototype.setMaxListeners(50);
  logger.info(`Connect using proxy:${JSON.stringify(proxy)} and account ${JSON.stringify(account)}`);


  const args = [
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--disable-web-security',
    '--disable-infobars',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--ignore-certificate-errors',
    '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92"',
  ];
  if(proxyUrl){
    args.push(`--proxy-server=${proxyUrl}`);
  }
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      slowMo: 50,
      ignoreHTTPSErrors: true,
      args,
    });
    logger.debug('Running');
    const page = (await browser.pages())[0];
    await page.setViewport({ width: 800, height: 1366 });
    await page.goto('https://www.nike.com/jp/launch', {
      waitUntil: ['domcontentloaded', 'networkidle2'],
    });

    if (Array.isArray(scenarioFunctionArray) == false)
      throw new Error('scenarioFunctionArray should be an array');
    // executing one by one
    while(scenarioFunctionArray.length > 0){
      const f = scenarioFunctionArray.shift();
      logger.info(`Executing scenario function ${JSON.stringify(obj, { page, logger })}`);
      await f(obj, { page, logger });
    }

    logger.debug('Scenarios execution finished');
  } catch (e) {
    // restoring proxy, account in our stack in case of exception
    logger.info(`Storing ${JSON.stringify({ proxy, account })} back to Stack`);
    paPairs.push({ account, proxy });
    throw e;
  } finally {
    //browser.close();
  }
};

// (async () => {
//   // logging
//   logger.info('Running tasks:', paPairs.length, ' in series ', numSeries);

//   while (paPairs.length > 0) {
//     logger.debug('New round');
//     //filling asyncqueue with tasks
//     //const account = {username: 'okanonike@gmail.com', password: 'Okano123'}
//     const async_queue = Array(paPairs.length).fill(() => runScenarios([require('./scenario/login'), require('./scenario/purchase')], paPairs.pop()));
//     await new Promise((resolve) => {
//       async.parallelLimit(async_queue, numSeries, results => resolve(results));
//     });
//     logger.debug('All done');
//     process.exit(0);
//   }
// })();

module.exports = { runScenarios, initProxies };
