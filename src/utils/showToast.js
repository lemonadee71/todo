import Toastify from 'toastify-js';
import Core from '../core';

export const showToast = (options) => {
  const toast = Toastify({
    ...options,
    gravity: 'bottom',
    position: 'left',
    stopOnFocus: false,
  });
  const currentToasts = [...Core.state.toasts];

  // show only 4 toasts at a time
  // ignores the set duration
  if (currentToasts.length > 3) currentToasts.shift().hideToast();

  toast.showToast();
  currentToasts.push(toast);
  Core.state.toasts = currentToasts;

  return toast;
};
