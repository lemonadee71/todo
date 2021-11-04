import Toast from '../components/Toast';
import { $, $$ } from './query';
import { cancellable } from './delay';
import { showToast } from './showToast';

export const useUndo =
  ({ element, text, callback: cb, delay = 3000, multiple = false }) =>
  (e) => {
    const [callback, cancel] = cancellable(cb, delay);
    const query = multiple ? $$ : $;

    const nodes =
      element instanceof HTMLElement ? [element] : [query(element)].flat();
    nodes.forEach((node) => {
      node.style.display = 'none';
    });

    callback(e);

    const toast = showToast({
      className: 'custom-toast',
      close: true,
      node: Toast(text, {
        text: 'Undo',
        callback: () => {
          nodes.forEach((node) => {
            if (document.body.contains(node))
              node.style.removeProperty('display');
          });

          cancel();
          toast.hideToast();
        },
      }),
    });
  };
