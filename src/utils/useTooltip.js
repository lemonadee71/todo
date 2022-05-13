import { createPopper } from '@popperjs/core';
import { POPPER_CONFIG } from '../constants';
import { $ } from './query';

let currentInstance;

export const useTooltip = (el) => {
  const tooltip = $.by.id('tooltip');

  const show =
    (callback = null) =>
    (e) => {
      callback?.(e);
      const { tooltip: tooltipText, tooltipPosition } = e.target.dataset;

      currentInstance = createPopper(el, tooltip, {
        placement: tooltipPosition || 'bottom',
        ...POPPER_CONFIG,
      });

      tooltip.firstElementChild.textContent =
        tooltipText || 'This is a tooltip';

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
