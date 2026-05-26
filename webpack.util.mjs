import HTMLMinifier from 'html-minifier';
import jsonminify from 'jsonminify';

function periodic_processor(str) {
  const data = {
    "elements": []
  };

  const props_to_get = ["name", "symbol"];

  const parsed = JSON.parse(str);
  const elements = parsed.elements;
  for (const element of elements) {
    const new_element = {};

    for (const target_key of props_to_get) {
      new_element[target_key] = element[target_key];
    }

    data.elements.push(new_element);
  }

  return JSON.stringify(data);
}

export function json_minifier(content, absoluteFrom) {
  content = content.toString('utf8');

  if (absoluteFrom.endsWith('PeriodicTableJSON.json')) {
    content = periodic_processor(content);
  }

  return Buffer.from(jsonminify(content));
}

export function html_minifier(content, absoluteFrom) {
  content = content.toString('utf8');

  const minified = HTMLMinifier.minify(content, {
    html5: true,
    keepClosingSlash: true,
    minifyCSS: true,
    quoteCharacter: '"',
    removeComments: true,
    minifyJS: true,
    removeTagWhitespace: true,
    caseSensitive: true
  });

  return Buffer.from(minified);
}