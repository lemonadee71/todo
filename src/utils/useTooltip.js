import { createPopper } from '@popperjs/core';
import { POPPER_CONFIG } from '../core/constants';
import { $ } from './query';

let currentInstance;

export const useTooltip = (el) => {
  const tooltip = $.by.id('tooltip');

  const show =
    (callback = null) =>
    (e) => {
      callback?.(e);

      currentInstance = createPopper(el, tooltip, POPPER_CONFIG);

      tooltip.firstElementChild.textContent =
        e.target.dataset.tooltipText || 'This is a tooltip';
      tooltip.setAttribute('data-show', '');
    };

  const hide =
    (callback = null) =>
    (e) => {
      callback?.(e);

      tooltip.firstElementChild.textContent = '';
      tooltip.removeAttribute('data-show');

      currentInstance?.destroy();
    };

  return [show, hide];
};
