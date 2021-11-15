import Toast from '../components/Toast';
import { $, $$ } from './query';
import { cancellable } from './delay';
import { showToast } from './showToast';
import Core from '../core';

export const useUndo =
  ({
    selector,
    text,
    callback: cb,
    delay = 3000,
    multiple = false,
    onCancel = null,
  }) =>
  (e) => {
    const [callback, cancel] = cancellable(cb, delay + 500);
    const query = multiple ? $$ : $;

    const selectors = selector.split(',');

    selectors
      .map((str) => query(str))
      .flat()
      .forEach((node) => {
        node.style.display = 'none';
      });

    callback(e);
    Core.state.undo.push(...selectors);

    const toast = showToast({
      delay,
      className: 'custom-toast',
      close: true,
      node: Toast(text, {
        text: 'Undo',
        callback: () => {
          selectors
            .map((str) => query(str))
            .flat()
            .forEach((node) => {
              if (document.body.contains(node))
                node.style.removeProperty('display');
            });

          cancel();
          onCancel?.();
          toast.hideToast();

          Core.state.undo = Core.state.undo.filter(
            (str) => !selectors.includes(str)
          );
        },
      }),
    });
  };
