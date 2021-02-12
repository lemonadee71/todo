import Component from '../helpers/component';
import { closeModal } from '../helpers/helpers';

const Modal = () => {
  return Component.parseString`
  <div class="modal-backdrop">
    <div id="modal">
      <span class="close" ${{ onClick: closeModal }}>&times;</span>
      <div id="modal-content"></div>
    </div>
  </div>
  `;
};

export default Modal;
