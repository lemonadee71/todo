import Toast from '../components/Toast';
import { $ } from './query';
import { cancellable } from './delay';
import { showToast } from './showToast';

export const createUndoFn =
  (selector, cb, text, delay = 3000) =>
  () => {
    const [deleteFn, cancel] = cancellable(cb, delay);

    const node = $(selector);
    const previousStyle = window.getComputedStyle(node).display;
    node.style.display = 'none';
    deleteFn();

    const toast = showToast({
      className: 'custom-toast',
      close: true,
      node: Toast(text, {
        text: 'Undo',
        callback: () => {
          const _node = $(selector);
          if (_node) _node.style.display = previousStyle;

          cancel();
          toast.hideToast();
        },
      }),
    });
  };
