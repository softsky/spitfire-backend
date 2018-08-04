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
    const browser = await puppeteer.launch({
	headless: false,
	slow:100,
	// slowMo: 'r',
	ignoreHTTPSErrors: true,
	args: [
		`--proxy-server=${proxyUrl}`,
		// "--disable-setuid-sandbox",
		// "--no-sandbox",
		// "--disable-web-security",
		"--disable-infobars",
		"--disable-accelerated-2d-canvas",
		"--disable-gpu",
		//"--ignore-certificate-errors",
		// "--user-agent='Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92'"
	]});
	const pages = await browser.pages();
	const page = pages[0];
	await page.addScriptTag({'url':'https://code.jquery.com/jquery-3.3.1.js'}) //easier to debug selectors, will remove later
	await page.setViewport({width:375,height:812});


    try {
        console.log('ProxyURL', proxyUrl, args);
        const browser = await puppeteer.launch({
	    headless: false,
	    slowMo: 100,
	    args: args});
        console.log('Running');        
        const page = await browser.newPage();
        
	await page.goto('https://www.nike.com/jp/launch/', {
	    waitUntil: ['domcontentloaded', 'networkidle0']
	});


        if(Array.isArray(scenarioFunction)){ 
            for(let f in scenarioFunction){
                console.log('Executing function', f);
                await f({proxy, account}, page);
            }
        } else {
            await scenarioFunction({proxy, account}, page);
        }
        
	await scenarioFunction(options, page);
	await page.goto('https://www.nike.com/jp/launch/t/air-max-90-1-white-neutral-grey-black/')
	// await page.waitForNavigation({waitUntil: 'networkidle0'});
	await page.waitFor(1000)
	await page.click('.size-grid-dropdown.size-dropdown-button-css')
	await page.waitFor(1000)
	// await page.click('.size-grid-dropdown.size-dropdown-button-css.dropdown-button-with-focus-css')
	await page.click('.expanded li:nth-child(1)')
	await page.waitFor(1000)
	await page.click('.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width')
    } catch(e){
	console.log(e);
	// restoring proxy, account in our stack in case of exception
	console.info(`Storing ${JSON.stringify({proxy, account})} back to Stack`);
	paPairs.push({account, proxy});
    } finally{
        //browser.close(); //will change once order functionality is done
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
