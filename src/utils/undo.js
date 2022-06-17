import Toast from '../components/Toast';
import Core from '../core';
import { showToast } from './showToast';
import { $ } from './query';

export const useUndo =
  ({ type, data, message, onSuccess, onCancel, delay = 3000 }) =>
  () => {
    let isCancelled = false;
    let extracted;
    // store since position is stored in the node itself
    const position = $.data('id', data.id)?.dataset?.position;

    Core.event.emit(type.REMOVE, data, {
      onSuccess: (result) => {
        // we're assuming that there's only one listener
        // and that it is our main function
        // this will fail otherwise
        extracted = extracted || result;

        onSuccess?.(extracted);
      },
    });

    const toast = showToast({
      duration: delay,
      close: true,
      callback: () => {
        // send a message that delete is not cancelled
        // this is to avoid multiple writes/deletes to firestore
        if (!isCancelled) Core.event.emit(`${type.REMOVE}:timeout`, extracted);
      },
      node: Toast({
        text: message,
        action: {
          text: 'Undo',
          callback: () => {
            // insert the deleted item
            Core.event.emit(type.INSERT, {
              ...data,
              data: { item: extracted, position },
            });

            isCancelled = true;
            onCancel?.();
            toast.hideToast();
          },
        },
      }),
    });
  };
