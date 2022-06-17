import Toastify from 'toastify-js';
import Core from '../core';
import { TOAST_COLORS } from '../constants';

export const showToast = (options) => {
  const toast = Toastify({
    // default color; will be overridden with options
    style: {
      background: TOAST_COLORS.secondary.background,
      border: `1px solid ${TOAST_COLORS.secondary.border}`,
    },
    ...options,
    className: `custom-toast absolute box-border flex flex-row-reverse justify-between items-center px-3 py-2 rounded min-w-min w-64 max-w-[18rem] mx-auto xs:mx-0`,
    gravity: 'bottom',
    position: 'left',
    stopOnFocus: false,
    offset: {
      x: 10,
      y: 15,
    },
  });
  const currentToasts = [...Core.data.toasts];

  // show only 4 toasts at a time
  // ignores the set duration
  if (currentToasts.length > 3) currentToasts.shift().hideToast();

  toast.showToast();
  currentToasts.push(toast);
  Core.data.toasts = currentToasts;

  return toast;
};
