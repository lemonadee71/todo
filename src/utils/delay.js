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

  return [
    function cb(...args) {
      id = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    },
    function cancel() {
      clearTimeout(id);
    },
  ];
};
