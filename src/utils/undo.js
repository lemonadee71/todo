import Toast from '../components/Toast';
import { $ } from './query';
import { cancellable } from './delay';
import { showToast } from './showToast';

export const useUndo =
  ({ element, text, callback: cb, delay = 3000 }) =>
  (e) => {
    const [callback, cancel] = cancellable(cb, delay);

    const node = element instanceof HTMLElement ? element : $(element);
    const { display } = window.getComputedStyle(node);
    node.style.display = 'none';
    callback(e);

    const toast = showToast({
      className: 'custom-toast',
      close: true,
      node: Toast(text, {
        text: 'Undo',
        callback: () => {
          if (document.body.contains(node)) node.style.display = display;

          cancel();
          toast.hideToast();
        },
      }),
    });
  };
