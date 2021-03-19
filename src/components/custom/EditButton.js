import { EDIT_ICON } from '../Icons';

class EditButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML = EDIT_ICON;
  }
}

export default EditButton;
