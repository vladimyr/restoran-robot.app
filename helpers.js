export function trimLines(text, count) {
  while (count) {
    text = text.substring(text.indexOf('\n') + 1);
    count -= 1;
  }
  return text;
}

export function reformatText(text = '') {
  // adjust spaces around interpunction chars
  return text
    .replace(/\s*([(])\s*/g, ' $1')
    .replace(/\s*([):;,.])\s*/g, '$1 ');
}
