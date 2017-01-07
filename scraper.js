'use strict';

const urlJoin = require('url-join');

module.exports = { readPosts };

function readPosts($, $html, limit=10) {
  let $articles = $html.find('.userContentWrapper').slice(0, limit);
  let posts = [];
  $articles.each((_, el) => {
    let $el = $(el);
    let content = getContent($, $el);
    if (!content) return;
    let { url, timestamp } = getMetadata($el);
    posts.push({ content, url, timestamp });
  });
  return posts;
}

function getContent($, $article) {
  let $content = $article.find('.userContent p');
  let chunks = $content.map((_, el) => {
    let $el = $(el);
    return getText($el);
  }).get();
  return chunks.join('\n');
}

function getText($paragraph) {
  return $paragraph
    // replace all <br>-s with line feeds
    .find('br').replaceWith('\n').end()
    // remove all hidden parts
    .find('.text_exposed_hide').remove().end()
    // remove leading spaces
    .text().replace(/\n\s*/g, '\n')
    .trim();
}

function getMetadata($article) {
  let $abbr = $article.find('abbr');
  let $a = $abbr.parent();

  let url = urlJoin('https://facebook.com/', $a.attr('href'));
  let timestamp = $abbr.attr('data-utime') * 1000;

  return { url, timestamp };
}
