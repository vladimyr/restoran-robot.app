'use strict';

window.Promise = window.Promise || require('pinkie-promise');

import './style.styl';

import $ from 'zepto';
import html from 'bel';
import fecha from 'fecha';
import http from './http';
import { readPosts } from './scraper';
import pkg from './package.json';

const ua = `${pkg.name}/${pkg.version}`;
const url = 'https://facebook.com/dajyst/posts';
const phone = '+385957488338';

const reMenuHeading = /^Danas u ponudi\s*:\s*/i;
const rePrice = /\s*(\d+)?(?:kn|\.00)\s*/;

const isDailyMenu = post => reMenuHeading.test(post.content);

const timestampFormat = 'MMMM D [at] H:mm';
const date = timestamp => fecha.format(new Date(timestamp), timestampFormat);
const isToday = timestamp => (new Date()).getDate() === (new Date(timestamp)).getDate();

const renderMenu = offers => html`
  <ul class="menu">
  ${ offers.map(({ name, price }) => html`
    <li class="offer">
      <span class="name">${ name }</span>
      <span class="price price-${ price }">${ price }kn</span>
    </li>
  `)}
  </ul>
`;

const renderPost = post => html`
<div class="post">
  <span class="timestamp">
    <i class="icon-clock"></i> ${ date(post.timestamp) }
  </span>
  <div class="content">
  ${ post.offers ? renderMenu(post.offers) : post.content }
  </div>
  <a href="${ post.url }" target="_blank" class="btn">Open on Facebook</a>
  <a href="tel:${ phone }" target="_blank" class="btn btn-phone">
    <i class="icon-phone"></i> Order
  </a>
</div>
`;

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
