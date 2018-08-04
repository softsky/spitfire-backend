const proxyChain = require('proxy-chain')
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

let runScenario = async (scenarioFunction) => {
    
    const uuid = require('uuid')
    , puppeteer = require('puppeteer')
    , fname = uuid()
    , requests = [];

    let proxy, account, oldProxyUrl, proxyUrl;
    if(paPairs.length){
        let obj = {proxy, account} = paPairs.pop();
        oldProxyUrl = `http://${proxy.user}:${proxy.pwd}@${proxy.ip}:${proxy.port}`
        proxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);    
    }
    //require('events').EventEmitter.prototype.setMaxListeners(50);
    console.info('Connect using proxy:', proxy, ' and account ', account);
    let args = proxyUrl?[`--proxy-server=${proxyUrl}`]:undefined;
    let browser;
    
    try {
        console.log('ProxyURL', proxyUrl, args);
        browser = await puppeteer.launch({
	    headless: true,
	    slowMo: 100,
	    args: args});
        console.log('Running');        
        const page = await browser.newPage();
        
	await page.goto('https://www.nike.com/jp/launch/', {
	    waitUntil: ['domcontentloaded', 'networkidle0']
	});

	await page.setViewport({width:375,height:812});
	await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92');
        if(Array.isArray(scenarioFunction)){ 
            scenarioFunction.forEach(async f => {
                await f({proxy, account}, page);
            })
        } else {
            await scenarioFunction({proxy, account}, page);
        }
        
    } catch(e){
	console.log(e);
	// restoring proxy, account in our stack in case of exception
	console.info(`Storing ${JSON.stringify({proxy, account})} back to Stack`);
	paPairs.push({account, proxy});
    } finally{
        browser.close();
    }
}

(async () => {
    const stream = require('stream')
    , util = require('util')
    , fs = require('fs');
    
    const numSeries = 1;
    const pipeline = util.promisify(stream.pipeline);

    const accountPath = __dirname + '/../accounts.csv'
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

    while(paPairs.length > 0){
	console.log("New round");
	// filling asyncqueue with tasks
	//const account = {username: 'okanonike@gmail.com', password: 'Okano123'}
	const async_queue = Array(paPairs.length).fill(() => runScenario(require('./scenario/login')));
	await new Promise((resolve, reject) => {
	    async.parallelLimit(async_queue, numSeries, results => resolve(results));
	});
	console.log("All done");
        process.exit(0);
    }
})();

module.exports = runScenario

