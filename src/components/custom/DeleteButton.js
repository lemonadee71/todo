import { DELETE_ICON } from '../Icons';

class DeleteButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML = DELETE_ICON;
  }
}

export default DeleteButton;
