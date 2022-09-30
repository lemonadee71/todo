import PoorManJSX, { apply, html } from 'poor-man-jsx';
import { createDropdown } from '../utils/dropdown';

PoorManJSX.customComponents.define(
  'dropdown-wrapper',
  ({ children, props }) => {
    apply(children.dropdown, {
      onLoad: () => createDropdown(children.button, children.dropdown, props),
    });

    return html`<>${children}</>`;
  }
);
