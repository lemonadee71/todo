function attr(name, value = null) {
  return this(`[${name}${value ? `="${value}"` : ''}]`);
}

function data(name, value = null) {
  return attr.call(this, `data-${name}`, value);
}

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

$.attr = attr;
$.data = data;

$$.attr = attr;
$$.data = data;

$.all = $$;

export { $, $$ };
