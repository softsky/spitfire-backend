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

async function runScenario(scenarioFunction) {
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
	slowMo: 250,
	args: [
	    `--proxy-server=${proxyUrl}`,
	]});
    const page = await browser.newPage();

    async function setInputValue(sel, val) {
	await page.evaluate((data) => {
	    return document.querySelector(data.sel).value = data.val;
	}, {sel, val});
    }

    async function saveLog(path){
	fs.mkdirSync(`${path}`);
	await page.screenshot({path: `${path}/screenshot.png`});
	const html = await page.$eval('body', e => e.outerHTML);
	await fs.createWriteStream(`${path}/page.html`)
	    .write(html);
	// await fs.createWriteStream(`${path}/cookies.json`)
	// 	.write(JSON.stringify(page.cookies()));
	await fs.createWriteStream(`${path}/requests.json`)
	    .write(JSON.stringify(requests));
    }

    try {
	// await page.setRequestInterception(true);
	// page.on('request', request => {
	// 	//console.log(request.url());

	// 	requests.push({
	// 		url: request.url(),
	// 		method: request.method(),
	// 		postData: request.postData(),
	// 		headers: request.headers(),
	// 		response: request.response()
	// 	});
	// 	request.continue();
	// });


	await page.goto('https://www.nike.com/jp/launch/', {
	    //waitUntil: ['domcontentloaded', 'networkidle0']
	    waitUntil: ['domcontentloaded']
	});

	page.setViewport({width:375,height:812});
	page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92');
	await page.evaluate(scenarioFunction, {account});

	// await page.click('button[data-qa = "mobile-nav-menu-button"]');

	// console.log('[---] clicked');
	// await page.evaluate(async () => {
	//     document.querySelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button').click();
	// });

	// console.log('clicked');
	// await page.waitForSelector('input[type="email"]');
	// console.log('setting values');
	// await setInputValue('input[type="email"]', account.username),
	// await setInputValue('input[type="password"]', account.password);

	// await page.click('input[type="button"][value="ログイン"]'); 

	// await page.waitForSelector('figure img');

	// console.info('succesfully logged in. queue size:' + paPairs.length);
	
	// await saveLog(`playground/success/${fname}`);
	
	// await page.goto('https://www.nike.com/jp/launch/t/exp-x14-dark-grey-total-crimson-jp/', {
	//     waitUntil: ['domcontentloaded', 'networkidle0']});
	
	// await page.waitForSelector('button.size-grid-dropdown.size-dropdown-button-css');
	// await page.click('button.size-grid-dropdown.size-dropdown-button-css');
	// await page.click('select[name="sizedropdown"] > option:nth-child(2)');
	// await page.click('button[data-qa="add-to-jcart"]');

	// await page.click('a.jewel-cart-container').click();
	
	await page.waitForSelector('xxx');
    } catch(e){
	console.error(e);
	// restoring proxy, account in our stack in case of exception
	console.info(`Storing ${JSON.stringify({proxy, account})} back to Stack`);
	paPairs.push({account, proxy});

	await saveLog(`playground/failure/${fname}`);
    }
    //browser.close();
}
(async () => {
    const stream = require('stream')
    , util = require('util')
    , fs = require('fs');
    
    const numSeries = 10;
    const pipeline = util.promisify(stream.pipeline);

    const accountPath = __dirname + '/../account1.csv'
    , proxyPath = __dirname + '/../proxies.csv'
    , accountStream = fs.createReadStream(accountPath)
    , proxyStream  = fs.createReadStream(proxyPath);

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

    //const {scenario} = require('./scenario/login.js');

    const getScenarioFunction = async () => {
	return async (options) => {
	    // let document = global.document,
	    // 	window = global.window;
	    async function eventFire(el, etype){
		// for strings attepting to query Selector or xpath
		if(typeof el == 'string'){
		    try {
			el = document.querySelector(el);	
		    } catch(e){
			el = document.evaluate(el, document).iterateNext();
		    }
		}
		// if not found, throwing Error
		if(!el)
		    throw new Error('Can\'t find element', el);
		
		console.log(el);
		
		if (el.fireEvent) {
		    return new Promise((resolve, reject) => resolve(el.fireEvent('on' + etype)));
		} else {
		    var evObj = document.createEvent('Events');
		    evObj.initEvent(etype, true, false);		    
		    return new Promise((resolve, reject) => resolve(el.dispatchEvent(evObj)));
		}
	    }

	    async function click(el, delay) {
		const ret = eventFire(el, 'click');
		if(delay){
		    await sleep(delay);
		}
		return ret;		
	    }

	    // async function click(x,y, delay){
	    // 	var el = document.elementFromPoint(x,y);
	    // 	var event = new MouseEvent( "click", { clientX: x, clientY: y, bubbles: true } )
	    // 	el.dispatchEvent(event);
		
	    // 	if(delay){
	    // 	    await sleep(delay);
	    // 	}
	    // 	return ret;
	    // }
	    
	    

	    async function setVal(sel, val, delay) {
		const ret = document.querySelector(sel).value = val;
		if(delay){
		    await sleep(delay);
		}
		return ret;		
	    }

	    async function sleep(ms) {
		return new Promise((resolve, reject) => setTimeout(resolve, ms));
	    }

	    
	    console.log('Hello from executionContext');
	    
	    await click('button[data-qa="mobile-nav-menu-button"]', 2000);
	    await click('//*[@id="root"]/div/div/div[1]/nav/ul/li[1]/button', 5000);
	    await setVal('input[type="email"]', options.account.username, 1000);
	    await setVal('input[type="password"]', options.account.password, 1000);
	    const bounds = await el('input[type="button"][value="ログイン"]').clientRect();
	    await click('input[type="button"][value="ログイン"]', 2000);
	}

    }

    while(paPairs.length > 0){
	console.log("New round");
	// filling asyncqueue with tasks
	const account = {username: 'okanonike@gmail.com', password: 'Okano123'}
	const scenario = await getScenarioFunction();
	const async_queue = Array(paPairs.length).fill(() => runScenario(scenario));
	await new Promise((resolve, reject) => {
	    async.parallelLimit(async_queue, numSeries, results => resolve(results));
	});
	console.log("All done");
        //process.exit(0);
    }
})();

module.exports = {runScenario}
