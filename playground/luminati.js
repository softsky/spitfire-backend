#!/usr/bin/env node
console.log('To enable your free eval account and get CUSTOMER, YOURZONE and '
    +'YOURPASS, please contact sales@luminati.io');
require('request-promise')({
#    url: 'http://lumtest.com/myip.json',
    url: 'nike.com/jp/launch',
    proxy: 'http://lum-customer-softsky-zone-jp1-country-jp:4lz85bmb5tbo@zproxy.lum-superproxy.io:22225'
}).then(function(data, body){ console.log(data, body); }, function(err){ console.error(err); });
