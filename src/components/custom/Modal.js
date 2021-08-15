import { html, render } from 'poor-man-jsx';
import { AppEvent } from '../../emitters';

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
    AppEvent.emit('modal.close');
    this.style.display = 'none';
    this.clearContent();

    return this;
  }

  changeContent(content) {
    render(content, this.querySelector('#modal-content'));

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
