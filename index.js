'use strict';

window.Promise = window.Promise || require('pinkie-promise');

import './style.styl';

import $ from 'zepto';
import h from 'hyperscript';
import fecha from 'fecha';
import http from './http';
import { readPosts } from './scraper';
import pkg from './package.json';

const ua = `${pkg.name}/${pkg.version}`;
const url = 'https://facebook.com/dajyst/posts';
const phone = '+385957488338';

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

const $spinner = $('.spinner');
const $output = $('.output');

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
  return http(url, { headers: { 'User-Agent': ua } })
    .then(body => $(`${ body }</body></html>`))
    .then($html => readPosts($html, limit))
    .then(posts => posts.map(post => parsePost(post)));
}

function parsePost(post) {
  if (!isDailyMenu(post)) {
    post.type = 'standard';
    return post;
  }

  const menu = post.content.replace(reMenuHeading, '');
  post.offers = parseMenu(menu);
  post.type = 'menu';
  return post;
}

function parseMenu(menu) {
  let offers = [];
  const tokens = menu.split(rePrice);

  let i = 0;
  const len = tokens.length - 1;
  while (i < len) {
    offers.push({
      name: tokens[i],
      price: parseInt(tokens[i + 1], 10)
    });
    i += 2;
  }

  return offers;
}
