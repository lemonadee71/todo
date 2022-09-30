import { useFloating } from './floating';
import { $ } from './query';

export const useTooltip = (target, options) => {
  // TODO: Switch to global refs (probably put in Core)
  const tooltip = $('#tooltip');
  const tooltipText = $('#tooltip_text');
  const tooltipArrow = $('#tooltip_arrow');
  const update = useFloating(target, tooltip, tooltipArrow, options);

  const show = (e) => {
    update(() => {
      let { tooltip: text } = e.target.dataset;
      text = text.startsWith('$')
        ? e.target.getAttribute(text.replace('$', ''))
        : text;

      tooltipText.textContent = text || 'This is a tooltip';
      tooltip.setAttribute('data-show', '');
    });
  };

  const hide = () => {
    tooltipText.textContent = '';
    tooltip.removeAttribute('data-show');
  };

  return [show, hide];
};
