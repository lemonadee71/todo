import Modal from './Modal';
import Chip from './Chip';
import EditButton from './EditButton';
import DeleteButton from './Buttons';

const defineCustomElements = () => {
  customElements.define('modal-el', Modal);
  customElements.define('label-chip', Chip);
  customElements.define('edit-btn', EditButton, { extends: 'button' });
  customElements.define('delete-btn', DeleteButton, { extends: 'button' });
};

export default defineCustomElements;
