import Modal from './Modal';
import Chip from './Chip';

const defineCustomElements = () => {
  customElements.define('modal-el', Modal);
  customElements.define('label-chip', Chip);
};

export default defineCustomElements;
