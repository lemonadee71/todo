import { html, render, createHook } from 'poor-man-jsx';

class Modal extends HTMLElement {
  constructor() {
    super();
    [this.state, this._revoke] = createHook({
      content: [],
      contentClass: '',
    });
  }

  connectedCallback() {
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
        <div
          role="modal__content"
          style="position: relative;"
          ${{
            $class: this.state.$contentClass,
            $children: this.state.$content(
              (value) =>
                html`
                  <span
                    role="modal__close-btn"
                    class="close"
                    ${{ onClick: this.close }}
                  >
                    &times;
                  </span>
                  ${value}
                `
            ),
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

  changeContent = (content, contentClass = '') => {
    this.state.content = content;
    this.state.contentClass = contentClass;

    return this;
  };

  clearContent = () => {
    this.state.content = [];
    this.state.contentClass = '';

    return this;
  };
}

export default Modal;
