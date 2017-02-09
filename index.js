'use strict';

window.Promise = window.Promise || require('pinkie-promise');

require('./style.styl');

const $ = require('zepto');
const h = require('hyperscript');
const fetch = require('whatwg-fetch');
const urlJoin = require('url-join');
const fecha = require('fecha');
const { readPosts } = require('./scraper');

const proxy = 'https://cors.now.sh/';

const url = 'https://facebook.com/dajyst/posts';
const phone = '+385957488338';

const postSelector = '.fbUserContent';

const reMenuHeading = /^Danas u ponudi\s*:\s*/i;
const rePrice = /\s*(\d+)?(?:kn)\s*/;

const isDailyMenu = post => reMenuHeading.test(post.content);

const timestampFormat = 'MMMM D [at] H:mm';
const date = timestamp => fecha.format(new Date(timestamp), timestampFormat);
const isToday = timestamp => (new Date()).getDate() === (new Date(timestamp)).getDate();

const renderMenu = offers =>
  h('ul.menu',
    offers.map(({ name, price }) =>
      h('li.offer',
        h('span.name', name),
        h('span.price', `${ price }kn`))));

const renderPost = post =>
  h('div.post',
    h('span.timestamp',
      h('i.icon-clock'), date(post.timestamp)),
    h('div.content',
      post.offers ? renderMenu(post.offers) : post.content),
    h('a.btn', { href: post.url, target: '_blank' },
      'Open on Facebook'),
    h('a.btn.btn-phone', { href: `tel:${ phone }`, target: '_blank' },
      h('i.icon-phone'), 'Order'));

let $spinner = $('.spinner');
let $output = $('.output');

fetchPosts(url, 5)
  .then(posts => {
    posts.forEach(post =>
      $(renderPost(post))
        .addClass(post.type)
        .toggleClass('today', isToday(post.timestamp))
        .appendTo($output));

    $output.show();
    $spinner.hide();
  });

function fetchPosts(fbUrl, limit) {
  let url = urlJoin(proxy, fbUrl);
  return fetch(url)
    .then(resp => resp.json())
    .then(body => $(`${ body }</body></html>`))
    .then($html => readPosts($html, limit, postSelector))
    .then(posts => posts.map(post => parsePost(post)));
}

function parsePost(post) {
  if (!isDailyMenu(post)) {
    post.type = 'standard';
    return post;
  }

  let menu = post.content.replace(reMenuHeading, '');
  post.offers = parseMenu(menu);
  post.type = 'menu';
  return post;
}

function parseMenu(menu) {
  let offers = [];
  let tokens = menu.split(rePrice);

  let i = 0;
  let len = tokens.length - 1;
  while (i < len) {
    offers.push({
      name: tokens[i],
      price: parseInt(tokens[i + 1], 10)
    });
    i += 2;
  }

  return offers;
}
