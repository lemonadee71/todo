export const debounce = function (fn, delay = 100) {
  let id;

  return function cb(...args) {
    clearTimeout(id);

    id = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const cancellable = function (fn, delay = 1000) {
  let id;

  function cancel() {
    clearTimeout(id);
  }

  function cb(...args) {
    cancel();

    id = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }

  return [cb, cancel];
};
