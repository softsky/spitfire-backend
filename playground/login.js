const uuid = require('uuid/v4');
const axios = require('axios-https-proxy-fix');
const qs = require('qs');


// TODO: we should use one proxy for a one user
const username = 'adidasjpreport+9661@gmail.com';
const password = 'Teamjordan123';
const clientId = uuid();

const proxy = {
  host: 'zproxy.lum-superproxy.io',
  port: 22225,      
  auth: {
    username: 'lum-customer-softsky-zone-jp1-country-jp',
    password: '4lz85bmb5tbo',
  },
};


function login(username, password) {
  const headers = {
    'Host':             's3.nikecdn.com',
    'Accept':           '*/*',
    'Accept-Encoding':  'gzip, deflate',
    'Accept-Language':  'en-us',
    'Content-Type':     'application/json',
    'Origin':           'https://s3.nikecdn.com',
    'Connection':       'keep-alive',
    'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg=='
  };

  const params = {
    'appVersion':         '431',
    'experienceVersion':  '360',
    'uxid':               'com.nike.commerce.snkrs.ios',
    'locale':             'en_US',
    'backendEnvironment': 'identity',
    'browser':            'Apple Computer, Inc.',
    'os':                 'undefined',
    'mobile':             'true',
    'native':             'true',
    'visit':              '1',
    'visitor':            clientId
  };

  const payload = {
    "client_id": clientId,
    "grant_type": "password",
    "password": password,
    "username": username,
    "ux_id": "com.nike.commerce.snkrs.ios",
  }

  const queryString = qs.stringify(params);
  
  const request = axios.create({
    headers,
    proxy,
    httpAgent: new http.Agent({ keepAlive: true, rejectUnauthorized: false }),
    httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false})
  });

  return request.post('https://s3.nikecdn.com/login', queryString, payload);
}

function minversionRequest() {
  const headers = {
    'Host':             's3.nikecdn.com',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg==',
    'Accept':           '*/*',
    'User-Agent':       'SNKRS-inhouse/3.3.3 (iPhone; iOS 10.2; Scale/2.00)',
    'Accept-Language':  'en-US;q=1',
    'Accept-Encoding':  'gzip, deflate',
    'Connection':       'keep-alive',
  }
  
  const request = axios.create({
	  headers,
	  proxy,
	  httpAgent: new http.Agent({ keepAlive: true, rejectUnauthorized: false }),
	  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false})
  });

  return request.get('https://s3.nikecdn.com/minversionapi/iOS.json');
}

function mobileRequest() {
  const headers = {
    'Host':             's3.nikecdn.com',
    'Accept':           'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg==',
    'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92',
    'Accept-Language':  'en-us',
    'Accept-Encoding':  'gzip, deflate',
    'Connection':       'keep-alive'
  };
  
  const params = {
    'mid':                '06991873067900528515903792859936812381?iOSSDKVersion=2.8.4',
    'clientId':           clientId,
    'uxId':               'com.nike.commerce.snkrs.ios',
    'view':               'none',
    'locale':             'en_US',
    'backendEnvironment': 'identity'
  }

  const queryString = qs.stringify(params);
  
  const request = axios.create({
    headers,
    proxy,
	  httpAgent: new http.Agent({ keepAlive: true, rejectUnauthorized: false }),
	  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false})
  });

  return request.get('https://s3.nikecdn.com/unite/mobile.html', queryString);
}

function mobileRequest() {
  const headers = {
    'Host':             's3.nikecdn.com',
    'Accept':           'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg==',
    'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92',
    'Accept-Language':  'en-us',
    'Accept-Encoding':  'gzip, deflate',
    'Connection':       'keep-alive',
  };
  
  const params = {
    'mid':                '06991873067900528515903792859936812381?iOSSDKVersion=2.8.4',
    'clientId':           clientId,
    'uxId':               'com.nike.commerce.snkrs.ios',
    'view':               'none',
    'locale':             'en_US',
    'backendEnvironment': 'identity'
  }

  const queryString = qs.stringify(params);
  
  const request = axios.create({
    headers,
    proxy,
  });

  return request.get('https://s3.nikecdn.com/unite/mobile.html', queryString);
}

function mobileRequest() {
  const headers = {
    'Host':             's3.nikecdn.com',
    'Accept':           'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg==',
    'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92',
    'Accept-Language':  'en-us',
    'Accept-Encoding':  'gzip, deflate',
    'Connection':       'keep-alive'
  };
  
  const params = {
    'mid':                '06991873067900528515903792859936812381?iOSSDKVersion=2.8.4',
    'clientId':           clientId,
    'uxId':               'com.nike.commerce.snkrs.ios',
    'view':               'none',
    'locale':             'en_US',
    'backendEnvironment': 'identity'
  }

  const queryString = qs.stringify(params);
  
  const request = axios.create({
    headers,
    proxy
  });

  return request.get('https://s3.nikecdn.com/unite/mobile.html', queryString);
}

async function appInitialization() {
  await minversionRequest();
  await mobileRequest();
}

async function run() {
  try {
    await appInitialization();
    await login();
  } catch (error) {
    console.error('error', error);
  }
}

async function appInitialization() {
	console.info('before minversionapi');
	await minversionRequest().then(console.log.bind(console));
	console.info('before mobileRequest');
	await mobileRequest().then(console.log.bind(console));
}

async function run() {
	try {
		console.info('before init');
		await appInitialization();
		console.info('before login');
		await login();
	} catch (error) {
		console.error('error', error);
	}
}


run();
