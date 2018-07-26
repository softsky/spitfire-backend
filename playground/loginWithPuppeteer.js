const puppeteer = require('puppeteer')
, proxyChain = require('proxy-chain')
, stream = require('stream')
, util = require('util')
, csv = require('csv')
, async = require('async')
, fs = require('fs');


//const username = 'adidasjpreport+9661@gmail.com';
//const password = 'Teamjordan123';

const paPairs = []
, accounts = [];

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
async function runWithProxy() {
	const {proxy, account} = paPairs.pop()
	, oldProxyUrl = `http://${proxy.user}:${proxy.pwd}@${proxy.ip}:${proxy.port}`
	, proxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
	
	console.info('Connect using proxy:', proxy, ' and account ', account);
	await puppeteer.launch({
		headless: true,
		args: [
			`--proxy-server=${proxyUrl}`,
		]})
		.then(async browser => {
			const page = await browser.newPage();

			async function setInputValue(sel, val) {
				await page.evaluate((data) => {
					return document.querySelector(data.sel).value = data.val;
				}, {sel, val});
			}

			try {
				//await page.authenticate({username: proxy.user, password: proxy.pwd});
				//const page = await browser.targets()[1].page();
				await page.setRequestInterception(true);
				page.on('request', request => {
					//console.log(request.url());
					request.continue();
				});
				
				page.setViewport({width:960,height:768});
				
				await page.goto('https://www.nike.com/jp/launch/', {
					/* waitUntil: ['domcontentloaded', 'networkidle0'] */});
				

				// puppeteer solution, not clicking on Login button somehow
				await page.click('button[aria-label="メニュー"]');
				console.log('Looking for button'); 
				// const buttons = await page.$x("//*[contains(text(), 'Nike+')]");
				// if (buttons.length > 0) {
				// 	console.log('Button:', buttons[0].textContent);
				// 	await buttons[0].click();
				// } else {
				// 	throw new Error("Login button not found");
				// }

				// solution 2 - does not work
				// (await page.$$eval('button', b => b
				//                    .filter(b => b.textContent.indexOf('Nike+') > -1)
				//                   ))[0].click()

				// solution 3 does not work
				// const e = await page.mainFrame().$('button[data-qa = "join-login-button"]');
				// if(!e)
				// 	throw new Error('Click button not found');
				// await e.click();

				await page.evaluate(async () => {
					document.querySelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button').click();
				});
				

				console.log('Clicked');
				await page.waitForSelector('input[type="email"]');
				await setInputValue('input[type="email"]', account.username);
				await setInputValue('input[type="password"]', account.password);
				await page.click('input[type="button"]');

				console.info('succesfully logged in');
				await page.evaluate(async () => {
					
				});
			} catch(e){
				browser.close();
				console.error(e);
				// restoring proxy, account in our stack in case of exception
				console.info(`Storing {${proxy}, ${account}} back to Stack`);
				paPairs.push({proxy, account}); 
			}
		})
}
(async () => {
	const numSeries = 10;
	const pipeline = util.promisify(stream.pipeline);
	
	const accountPath = __dirname + '/accounts.csv'
	, proxyPath = __dirname + '/proxies.csv'
	, accountStream = fs.createReadStream(accountPath)
	, proxyStream  = fs.createReadStream(proxyPath);
	
	await pipeline(accountStream,
	               csv.parse({delimiter:':'}),
	               csv.transform((record) => {
		               
		               const username = record[0]
		               , password = record[1]
		               , account = {username, password};

		               accounts.push(account);
	               }));

	shuffle(accounts);
	
	await pipeline(proxyStream,
	               csv.parse({delimiter:':'}),
	               csv.transform((record) => {
		               
		               const proxy = {
			               ip: record[0],
			               port: record[1],
			               user: record[2],
			               pwd: record[3]
		               }
		               , account = accounts.pop();

		               console.log(account);
		               paPairs.push({proxy, account});
	               }));
	// shuffling our array of pairs
	shuffle(paPairs);
	// logging
	console.info('Running tasks:', paPairs.length, ' in series ', numSeries);

	// filling asyncqueue with tasks
	const async_queue = Array(paPairs.length).fill((cb) => {
		runWithProxy()
			.then(cb)
			.catch(console.error.bind(console));
	});
	await async.parallelLimit(async_queue, numSeries);
})();

