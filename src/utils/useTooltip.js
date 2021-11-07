import { createPopper } from '@popperjs/core';
import { $ } from './query';

let currentInstance;

export const useTooltip = (el) => {
  const tooltip = $.by.id('tooltip');

  const show = (e) => {
    currentInstance = createPopper(el, tooltip, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    tooltip.firstElementChild.textContent =
      e.target.dataset.tooltipText || 'This is a tooltip';
    tooltip.setAttribute('data-show', '');
  };

  const hide = () => {
    tooltip.firstElementChild.textContent = '';
    tooltip.removeAttribute('data-show');

    currentInstance?.destroy();
  };

  return [show, hide];
};
