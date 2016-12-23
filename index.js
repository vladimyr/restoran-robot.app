'use strict';

require('./style.styl');

const $ = require('zepto');
require('zepto/src/stack.js');
const fetch = require('whatwg-fetch');
const urlJoin = require('url-join');
const fecha = require('fecha');
const { readPosts } = require('./scraper');

const proxy = 'https://cors.now.sh/';

const timestampFormat = 'MMMM D [at] H:mm';
const date = timestamp => fecha.format(new Date(timestamp), timestampFormat);

const template = post => `
  <div class="post">
    <span class="timestamp">${ date(post.timestamp) }</span>
    <div class="content"><pre>${ post.content }<pre></div>
    <a href=${ post.url } target="_blank">Open on Facebook</a>
  </div>
`;

let $spinner = $('#spinner');
let $output = $('#output');

let url = 'https://facebook.com/dajyst/posts';
fetchPosts(url, 2)
  .then(posts => {
    let html = posts.map(post => template(post)).join('\n');
    $output.html(html).show();
    $spinner.hide();
  });

function fetchPosts(fbUrl, limit) {
  let url = urlJoin(proxy, fbUrl);
  return window.fetch(url)
    .then(resp => resp.json())
    .then(body => $(`${ body }</body></html>`))
    .then($html => readPosts($, $html, limit));
}
