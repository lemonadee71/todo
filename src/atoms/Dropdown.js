import { apply, html } from 'poor-man-jsx';
import { createDropdown } from '../utils/dropdown';

const DropdownWrapper = ({ children, props }) => {
  apply(children.dropdown, {
    onLoad: () => createDropdown(children.button, children.dropdown, props),
  });

  return html`<>${children}</>`;
};

export default DropdownWrapper;
