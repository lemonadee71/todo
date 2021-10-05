import EventEmitter from './classes/Emitter';
import { getParams, getParamValues } from '../utils/params';

const History = (() => {
  const $ = new EventEmitter();
  const cache = new Map();
  const { history } = window;

  const getPath = () => window.location.pathname;

  const getHash = () => window.location.hash.replace('#', '');

  const syncPath = () => {
    $.emit('popstate', getPath(), history.state);
  };

  const syncHash = () => {
    $.emit('hashchange', getHash(), history.state);
  };

  const _callbackWrapper = (fn, pattern, params) => (path, state) => {
    if (!pattern.exec(path)) return;

    const payload = {
      path,
      state,
    };

    if (params.length) {
      payload.params = getParamValues(path, pattern, params);
    }

    fn.call(null, payload);
  };

  const onPopState = (fn, options) => {
    $.on('popstate', fn, options);
  };

  const onHashChange = (fn, options) => {
    $.on('hashchange', fn, options);
  };

  const onChangeToPath = (path, fn, options) => {
    const order = path.split('/').length - 1;
    const [pattern, paramNames] = getParams(path);
    const cb = _callbackWrapper(fn, pattern, paramNames);

    cache.set(fn, cb);
    $.on(options.hash ? 'hashchange' : 'popstate', cb, { ...options, order });
  };

  const off = (fn) => {
    $.off('popstate', cache.get(fn) || fn);
    $.off('hashchange', cache.get(fn) || fn);
    cache.delete(fn);
  };

  const clear = () => $.clear();

  const push = (path, state) => {
    history.pushState(state, null, path);
    syncHash();
    syncPath();
  };

  const replace = (path, state) => {
    history.replaceState(state, null, path);
    syncHash();
    syncPath();
  };

  const forward = () => {
    history.forward();
    syncHash();
    syncPath();
  };

  const back = () => {
    history.back();
    syncHash();
    syncPath();
  };

  const go = (n = 0) => {
    history.go(n);
    syncHash();
    syncPath();
  };

  window.addEventListener('popstate', syncPath);
  window.addEventListener('hashchange', syncHash);

  return {
    back,
    clear,
    forward,
    go,
    push,
    replace,
    off,
    onChangeToPath,
    onHashChange,
    onPopState,
    syncPath,
    getHash,
    getPath,
  };
})();

export default History;
