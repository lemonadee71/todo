// we get a bug when we don't wrap some functions
// in an anonymous callback so we create this util
export const wrap =
  (fn) =>
  (...args) =>
    fn(...args);

export const appendSuccess = (str) => [str].flat().map((s) => s + '.success');

export const appendError = (str) => [str].flat().map((s) => s + '.error');
