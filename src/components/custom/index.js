import Modal from './Modal';
import Link from './Link';

const defineCustomElements = () => {
  customElements.define('my-modal', Modal);
  customElements.define('navigo-link', Link, { extends: 'a' });
};

export default defineCustomElements;
