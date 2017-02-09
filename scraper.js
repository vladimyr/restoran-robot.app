'use strict';

const $ = require('zepto');
const urlJoin = require('url-join');

module.exports = { readPosts };

function readPosts($html, limit=10, selector='[role=article]') {
  let $articles = $html.find(selector).slice(0, limit);
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
