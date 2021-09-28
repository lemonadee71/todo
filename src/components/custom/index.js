import Modal from './Modal';
import Chip from './Chip';
import Link from './Link';

const defineCustomElements = () => {
  customElements.define('my-modal', Modal);
  customElements.define('label-chip', Chip);
  customElements.define('navigo-link', Link, { extends: 'a' });
};

export default defineCustomElements;
