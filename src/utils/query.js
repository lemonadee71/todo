function attr(name, value = null, context = document) {
  return this(`[${name}${value ? `="${value}"` : ''}]`, context);
}

function data(name, value = null, context = document) {
  return attr.call(this, `data-${name}`, value, context);
}

function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function byId(id) {
  return document.getElementById(id);
}

function byClassName(cls, context = document) {
  return Array.from(context.getElementsByClassName(cls));
}

function byTagName(tag, context = document) {
  return Array.from(context.getElementsByTagName(tag));
}

$.attr = attr;
$.data = data;

$$.attr = attr;
$$.data = data;

$.by = attr.bind($$);

$.by.id = byId;
$.by.class = byClassName;
$.by.tag = byTagName;

$.all = $$;

export { $, $$ };
