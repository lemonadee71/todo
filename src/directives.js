import PoorManJSX, { apply } from 'poor-man-jsx';
import { HIDE_EVENTS, SHOW_EVENTS } from './constants';
import { copy } from './utils/misc';
import { makeKeyboardSortable } from './utils/sortable';
import { useTooltip } from './utils/useTooltip';
import { applyValidation } from './utils/validate';

PoorManJSX.plugins.addDirective(
  {
    name: 'Input Validation',
    type: 'validate',
    getType: {
      attrName: (key) => (key === ':validate' ? ['validate', key] : null),
      objKey: (key) => (key === 'validateInput' ? ['validate'] : null),
    },
    callback: (element, data) => {
      applyValidation(element, data.value);
      element.removeAttribute(data.key);
    },
  },
  {
    name: 'Sortable',
    type: 'sortable',
    getType: {
      attrName: (key) => (key === ':sortable' ? ['sortable'] : null),
      objKey: (key) => (key === 'sortable' ? ['sortable'] : null),
    },
    callback: (element, data) => {
      apply(element, {
        onLoad: () => makeKeyboardSortable(element, data.value),
      });
      element.removeAttribute(':sortable');
    },
  },
  {
    name: 'Tooltips',
    type: 'tooltip',
    getType: {
      attrName: (key) => (key === 'data-tooltip' ? ['tooltip'] : null),
      objKey: (key) => (key === 'addTooltip' ? ['tooltip'] : null),
    },
    callback: (element, data) => {
      const options = {};

      if (typeof data.value === 'string') {
        options.placement = 'bottom';
      } else if (typeof data.value === 'object') {
        Object.assign(options, copy(data.value, ['text']));
        element.dataset.tooltip = data.value.text;
      }

      apply(element, {
        onLoad: () => {
          const [onShow, onHide] = useTooltip(element, options);

          SHOW_EVENTS.forEach((name) => element.addEventListener(name, onShow));
          HIDE_EVENTS.forEach((name) => element.addEventListener(name, onHide));
        },
      });
    },
  }
);
