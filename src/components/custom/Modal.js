import { html, render, createHook } from 'poor-man-jsx';

class Modal extends HTMLElement {
  constructor() {
    super();
    [this.state, this._revoke] = createHook({
      content: [],
      contentClass: '',
      closeBtnClass: '',
    });
  }

  connectedCallback() {
    this.state.closeBtnClass = this.getAttribute('close-btn-class') || '';

    const defaultBackdropStyle = {
      display: 'none',
      position: 'fixed',
      zIndex: '99',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(102, 102, 102, 0.4)',
    };

    if (!this.classList.length) Object.assign(this.style, defaultBackdropStyle);

    const content = html`
      <div role="modal">
        <span
          role="modal__close-btn"
          ${{ $class: this.state.$closeBtnClass, onClick: this.close }}
        >
          &times;
        </span>
        <div
          role="modal__content"
          ${{
            $class: this.state.$contentClass,
            $children: this.state.$content,
          }}
        ></div>
      </div>
    `;

    render(content, this);
  }

  disconnectedCallback() {
    this._revoke();
  }

  show = () => {
    this.style.display = 'block';

    return this;
  };

  close = () => {
    this.style.display = 'none';
    this.clearContent();

    return this;
  };

  changeContent = (content, contentClass = '', closeBtnClass = '') => {
    this.state.content = content;
    this.state.contentClass = contentClass;
    this.state.closeBtnClass = closeBtnClass || this.state.closeBtnClass;

    return this;
  };

  clearContent = () => {
    this.state.content = null;
    this.state.contentClass = '';
    this.state.closeBtnClass = this.getAttribute('close-btn-class') || '';

    return this;
  };
}

export default Modal;
