const getParams = (path, exact = true) => {
  const defaultParamPattern = '(\\w+)';

  const paramNames = (path.match(/:\w+/g) || []).map((param) =>
    param.replace(':', '')
  );
  const base = paramNames.length
    ? paramNames.reduce(
        (str, name) => str.replace(`:${name}`, defaultParamPattern),
        path
      )
    : path;
  const pattern = new RegExp(exact ? `^${base}$` : base);

  return [pattern, paramNames];
};

const getParamValues = (path, pattern, paramNames) => {
  const paramValues = (path.match(pattern) || []).slice(1);

  return paramValues.reduce((data, current, i) => {
    data[paramNames[i]] = current;

    return data;
  }, {});
};

export { getParams, getParamValues };
