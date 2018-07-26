#!/usr/bin/env node
// var fs = require('fs')
//     , path = require('path')
//     , certFile = path.resolve(__dirname, 'ssl/softsky.crt')
//     , keyFile = path.resolve(__dirname, 'ssl/softsky.key')
//     , request = require('request-promise');
 
// var options = {
//     url: 'https://www.nike.com/jp/launch/',
//     agentOptions: {
//         cert: fs.readFileSync(certFile),
//         key: fs.readFileSync(keyFile),
//         // Or use `pfx` property replacing `cert` and `key` when using private key, certificate and CA certs in PFX or PKCS12 format:
//         // pfx: fs.readFileSync(pfxFilePath),
// //        passphrase: '',
// //        securityOptions: 'SSL_OP_NO_SSLv3'
//     }
// //    passphrase: 'password',
// //    ca: fs.readFileSync(caFile),
//     //    proxy: 'http://lum-customer-softsky-zone-jp1-country-jp:4lz85bmb5tbo@zproxy.lum-superproxy.io:22225'    
// };
 
// request.get(options)
//     .then(function(data){ console.log(data); }, function(err){ console.error(err); });

const uuid = require('uuid/v4');
//const axios = require('axios-https-proxy-fix');

const axios = require('axios');

// TODO: we should use one proxy for a one user
const username = 'adidasjpreport+9661@gmail.com';
const password = 'Teamjordan123';
const clientId = uuid();

const headers = {
    'Host':             's3.nikecdn.com',
    'Accept':           '*/*',
    'Accept-Encoding':  'gzip, deflate',
    'Accept-Language':  'en-us',
    'Content-Type':     'application/json',
    'Origin':           'https://s3.nikecdn.com',
    'Connection':       'keep-alive',
    'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92',
    'X-NewRelic-ID':    'VQYGVF5SCBADUVBRBgAGVg==',
};


const proxy = {
  host: 'zproxy.lum-superproxy.io',
  port: 22225,      
  auth: {
    username: 'lum-customer-softsky-zone-jp1-country-jp',
    password: '4lz85bmb5tbo',
  },
};


const request = axios.create({headers, proxy});

request
    .get('https://www.nike.com/jp/launch')
    .then(console.log.bind(console))
    .catch(console.error.bind(console));


