'use strict';

require('./style.styl');

const $ = require('zepto');
require('zepto/src/stack.js');
const fetch = require('whatwg-fetch');
const urlJoin = require('url-join');
const fecha = require('fecha');
const { readPosts } = require('./scraper');

const proxy = 'https://cors.now.sh/';

const url = 'https://facebook.com/dajyst/posts';
const phone = '+385957488338';

const timestampFormat = 'MMMM D [at] H:mm';
const date = timestamp => fecha.format(new Date(timestamp), timestampFormat);
const isToday = timestamp => (new Date()).getDate() === (new Date(timestamp)).getDate();

const getClass = post => 'post' + (isToday(post.timestamp) ? ' today' : '');

const template = post => `
  <div class="${ getClass(post) }">
    <span class="timestamp"><i class="icon-clock"></i> ${ date(post.timestamp) }</span>
    <div class="content"><pre>${ post.content }<pre></div>
    <a href=${ post.url } target="_blank">Open on Facebook</a>
    <a class="btn-phone" href="tel:${ phone }" target="_blank"><i class="icon-phone"></i> Order</a>
  </div>
`;

let $spinner = $('.spinner');
let $output = $('.output');

fetchPosts(url, 5)
  .then(posts => {
    let html = posts.map(post => render(post)).join('\n');
    $output.html(html).show();
    $spinner.hide();
  });

function render(post) {
  let content = post.content;
  content = content.split('\n').slice(1).join('\n');
  content = content.replace(/\d+kn/g, price => `<span class="price"> ${price}</span>`);
  let data = { timestamp: post.timestamp, url: post.url, content };
  return template(data);
}

function fetchPosts(fbUrl, limit) {
  let url = urlJoin(proxy, fbUrl);
  return window.fetch(url)
    .then(resp => resp.json())
    .then(body => $(`${ body }</body></html>`))
    .then($html => readPosts($, $html, limit));
}
