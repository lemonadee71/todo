import Toast from '../components/Toast';
import Core from '../core';
import { showToast } from './showToast';
import { $ } from './query';

export const useUndo =
  ({ type, payload, text, onSuccess, onCancel, delay = 3000 }) =>
  () => {
    let isCancelled = false;
    let extracted;
    // store since position is stored in the node itself
    let node = $.data('id', payload.id);

    Core.event.emit(type.REMOVE, payload, {
      onSuccess: (result) => {
        // we're assuming that there's only one listener
        // and that it is our main function
        // this will fail otherwise
        extracted = extracted || result;

        onSuccess?.(extracted);
      },
    });

    const toast = showToast({
      delay,
      close: true,
      callback: () => {
        // send a message that delete is not cancelled
        // this is to avoid multiple writes/deletes to firestore
        if (!isCancelled) Core.event.emit(`${type.REMOVE}:timeout`, extracted);

        node = null;
      },
      node: Toast({
        text,
        action: {
          text: 'Undo',
          callback: () => {
            // insert the deleted item
            Core.event.emit(type.INSERT, {
              ...payload,
              data: { item: extracted, position: node?.dataset?.position },
            });

            isCancelled = true;
            onCancel?.();
            toast.hideToast();
          },
        },
      }),
    });
  };
