import Toast from '../components/Toast';
import { showToast } from './showToast';
import Core from '../core';

export const useUndo =
  ({ type, payload, text, onCancel, delay = 3000 }) =>
  () => {
    let extracted;
    Core.event.emit(type.REMOVE, payload, {
      onSuccess: (result) => {
        // we're assuming that there's only one listener
        // and that it is our main function
        // this will fail otherwise
        extracted = extracted || result;
      },
    });

    const toast = showToast({
      delay,
      className: 'custom-toast',
      close: true,
      node: Toast(text, {
        text: 'Undo',
        callback: () => {
          // insert the deleted item
          Core.event.emit(type.INSERT, {
            ...payload,
            data: { item: extracted, position: extracted.position },
          });

          onCancel?.();
          toast.hideToast();
        },
      }),
    });
  };
