'use strict';

const $ = require('zepto');
const urlJoin = require('url-join');

const selectors = [
  '.fbUserContent', // primary
  '[role=article]'  // fallback
];

module.exports = { readPosts };

function readPosts($html, limit=10) {
  let $articles = find($html, selectors).slice(0, limit);
  let posts = [];
  $articles.each((_, el) => {
    let $el = $(el);
    let content = getContent($el);
    if (!content) return;
    let { url, timestamp } = getMetadata($el);
    posts.push({ content, url, timestamp });
  });
  return posts;
}

function find(parent, selectors=[]) {
  let $parent = $(parent);
  let $elements = $();

  let i = 0;
  let len = selectors.length;
  while (i < len) {
    $elements = $parent.find(selectors[i]);
    if ($elements.length > 0) return $elements;
    i += 1;
  }

  return $elements;
}

const getText = $el => $el.text().replace(/\n\s*/g, '\n').trim();

function getContent($article) {
  let $content = $article.find('.userContent p');
  let chunks = $content.map((_, el) => {
    let $chunk = $(el);
    // remove all hidden parts
    $chunk.find('.text_exposed_hide').remove();
    // replace all <br>-s with line feeds
    $chunk.find('br').replaceWith('\n');
    return getText($chunk);
  }).get();
  return chunks.join('\n');
}

function getMetadata($article) {
  let $abbr = $article.find('abbr');
  let $a = $abbr.parent();

  let url = urlJoin('https://facebook.com/', $a.attr('href'));
  let timestamp = $abbr.attr('data-utime') * 1000;

  return { url, timestamp };
}
