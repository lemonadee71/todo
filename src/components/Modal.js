import Component from '../component';
import $ from '../helpers/getElement';

const Modal = () => {
  const closeModal = (e) => {
    $('#modal').style.display = 'none';
    $('#modalContent').innerHTML = '';
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
