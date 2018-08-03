const puppeteer = require('puppeteer')
, proxyChain = require('proxy-chain')
, csv = require('csv')
, async = require('async')
, fs = require('fs');

const paPairs = []
, accounts = []
, proxies = [];

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

async function runScenario(scenarioFunction, options) {
    const uuid = require('uuid')
    , fname = uuid()
    , requests = [];

    const {proxy, account} = paPairs.pop()
    , oldProxyUrl = `http://${proxy.user}:${proxy.pwd}@${proxy.ip}:${proxy.port}`
    , proxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
    //require('events').EventEmitter.prototype.setMaxListeners(50);
    console.info('Connect using proxy:', proxy, ' and account ', account);
    const browser = await puppeteer.launch({
	headless: false,
	slowMo: 50,
	args: [
	    `--proxy-server=${proxyUrl}`,
	]});
    const page = await browser.newPage();

    try {
	await page.goto('https://www.nike.com/jp/launch/', {
	    waitUntil: ['domcontentloaded', 'networkidle0']
	});

	await page.setViewport({width:375,height:812});
	await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92');
        await scenarioFunction(options, page);
    } catch(e){
	console.error(e);
	// restoring proxy, account in our stack in case of exception
	console.info(`Storing ${JSON.stringify({proxy, account})} back to Stack`);
	paPairs.push({account, proxy});
    }
    //browser.close();
}
(async () => {
    const stream = require('stream')
    , util = require('util')
    , fs = require('fs');
    
    const numSeries = 1;
    const pipeline = util.promisify(stream.pipeline);

    const accountPath = __dirname + '/../account1.csv'
    , proxyPath = __dirname + '/../proxies1.csv'
    , accountStream = fs.createReadStream(accountPath)
    , proxyStream  = fs.createReadStream(proxyPath);

    // FIXME:
    await pipeline(proxyStream,
	           csv.parse({delimiter:':'}),
	           csv.transform((record) => {
		       const proxy = {
			   ip: record[0],
			   port: record[1],
			   user: record[2],
			   pwd: record[3]
		       };
		       proxies.push(proxy);
	           }));

    shuffle(proxies);

    await pipeline(accountStream,
	           csv.parse({delimiter:':'}),
	           csv.transform((record) => {
		       proxies.unshift(proxies.pop());
		       const username = record[0]
		       , password = record[1]
		       , account = {username, password}
		       , proxy  = proxies[0];
		       accounts.push(account);

		       paPairs.push({proxy, account});
	           }));

    // shuffling our array of pairs
    shuffle(paPairs);
    // logging
    console.info('Running tasks:', paPairs.length, ' in series ', numSeries);


    const getScenarioFunction = () => {
	return async (options, page) => {
	    await page.click('button[data-qa="mobile-nav-menu-button"]');
            await page.waitForSelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
	    await page.click('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
            
            await page.waitForSelector('input[type="email"]');
            await page.type('input[type="email"]', options.account.username);
	    await page.waitForSelector('input[type="password"]');
            await page.type('input[type="password"]', options.account.password);
	    await page.click('input[type="button"][value="ログイン"]');
            await page.waitForNavigation({waitUntil: 'networkidle0'});
	}
    }

    while(paPairs.length > 0){
	console.log("New round");
	// filling asyncqueue with tasks
	const account = {username: 'okanonike@gmail.com', password: 'Okano123'}
	const scenario = getScenarioFunction();
	const async_queue = Array(paPairs.length).fill(() => runScenario(scenario, {account}));
	await new Promise((resolve, reject) => {
	    async.parallelLimit(async_queue, numSeries, results => resolve(results));
	});
	console.log("All done");
        //process.exit(0);
    }
})();

module.exports = {runScenario}
