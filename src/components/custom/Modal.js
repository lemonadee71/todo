import { html, render, createHook } from 'poor-man-jsx';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.stack = [];
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
      <div
        ${{
          $class: this.state.$contentClass((cls) => `modal__content ${cls}`),
        }}
      >
        <div
          class="modal__content"
          style="position: relative;"
          ${{
            $children: this.state.$content(
              (value) =>
                html`
                  <span class="modal__close-btn" ${{ onClick: this.close }}>
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
    this.clearContent();

    if (!this.stack.length) {
      this.style.display = 'none';
    }
    return this;
  };

  changeContent = (content, contentClass = '') => {
    this.stack.push({ content, cls: contentClass });
    this.state.content = content;
    this.state.contentClass = contentClass;

    this.show();

    return this;
  };

  clearContent = () => {
    // remove top of the stack
    this.stack.pop();
    const prevContent = this.stack[this.stack.length - 1];

    this.state.content = prevContent?.content || '';
    this.state.contentClass = prevContent?.cls || '';

    return this;
  };
}

export default Modal;
