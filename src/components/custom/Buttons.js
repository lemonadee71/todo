import { DELETE_ICON, EDIT_ICON } from '../Icons';

class EditButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML = EDIT_ICON;
  }
}

class DeleteButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML = DELETE_ICON;
  }
}

export { EditButton, DeleteButton };
