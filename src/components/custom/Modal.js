import { html, render, createHook } from 'poor-man-jsx';
import { $ } from '../../utils/query';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.stack = [];
    [this.state, this._revoke] = createHook({ contentClass: '' });
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
      <div ${{ $class: this.state.$contentClass }} style="position: relative;">
        <div class="modal__content" data-name="modal-content">
          <span class="modal__close-btn" ${{ onClick: this.close }}>
            &times;
          </span>
        </div>
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
    const length = this.stack.push({ content, cls: contentClass });
    this.state.contentClass = contentClass;

    // hide previous ones
    $.by('data-modalId', this.content).forEach((node) => {
      node.style.display = 'none';
    });

    // add and show new content
    $.data('name', 'modal-content', this).append(
      render(html` <div data-modalId="${length - 1}">${content}</div> `)
    );

    this.show();

    return this;
  };

  clearContent = () => {
    const prevLength = this.stack.length;

    // remove top of the stack
    this.stack.pop();
    $.data('modalId', `${prevLength - 1}`).remove();

    // show new top of the stack
    const newLength = this.stack.length;
    const prevContent = this.stack[newLength - 1];
    if (prevContent) {
      $.data('modalId', `${newLength - 1}`).style.display = 'block';
    }

    this.state.contentClass = prevContent?.cls || '';

    return this;
  };
}

export default Modal;
