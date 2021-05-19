import { html, render } from '../../helpers/component';
import event from '../../modules/event';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.clearContent = this.clearContent.bind(this);
  }

  connectedCallback() {
    this.classList.add('modal-backdrop');

    const element = html`
      <div id="modal">
        <span class="close" ${{ onClick: this.close }}>&times;</span>
        <div id="modal-content"></div>
      </div>
    `;

    this.appendChild(render(element));
  }

  show() {
    this.style.display = 'block';

    return this;
  }

  close() {
    event.emit('modal.close');
    this.style.display = 'none';
    this.clearContent();

    return this;
  }

  changeContent(content) {
    const isTemplate = (val) => val._type && val._type === 'template';
    const modalContent = this.querySelector('#modal-content');

    this.clearContent();

    if (isTemplate(content)) {
      modalContent.appendChild(render(content));
    } else {
      modalContent.appendChild(content);
    }

    return this;
  }

  clearContent() {
    const modalContent = this.querySelector('#modal-content');

    while (modalContent.firstElementChild) {
      modalContent.removeChild(modalContent.lastElementChild);
    }

    return this;
  }
}

export default Modal;
