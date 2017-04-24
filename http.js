'use strict';

const fetch = require('whatwg-fetch');
const urlJoin = require('url-join');
const qs = require('querystring');

module.exports = function http(url, options={}) {
  let method = (options.method || 'get').toUpperCase();
  let headers = options.headers || [];
  headers = Object.keys(headers).map(name =>`${name}|${headers[name]}`);

  let proxy = 'https://goxcors.appspot.com/cors';
  url = urlJoin(proxy, `?${ qs.stringify({ method, header: headers, url }) }`);
  return fetch(url).then(resp => resp.text());
};
