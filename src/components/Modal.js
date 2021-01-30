import Component from '../component';
import $, { clear, hide } from '../helpers/helpers';

const Modal = () => {
  const closeModal = (e) => {
    hide($('.modal-backdrop'));
    clear($('#modal-content'));
    e.stopPropagation();
  };

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
