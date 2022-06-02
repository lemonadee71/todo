import { html, render, createHook } from 'poor-man-jsx';
import Core from '../../core';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.stack = [];
    [this.state, this._revoke] = createHook({ content: [], contentClass: '' });
  }

  connectedCallback() {
    // close modal if the page changed
    this._removePageTracking = Core.router.on('*', this.close.bind(this));

    this.style.display = 'none';
    // add our default style
    this.classList.add('backdrop');

    render(
      html`
        <div class=${this.state.$contentClass}>
          ${this.state.$content((value) => render(value))}
        </div>
      `,
      this
    );
  }

  disconnectedCallback() {
    this._revoke();
    this._removePageTracking();
  }

  open = () => {
    this.style.display = 'block';

    return this;
  };

  close = () => {
    this.style.display = 'none';
    this.clear();

    return this;
  };

  clear = () => {
    this.stack = [];
    this.state.content = [];
    this.state.contentClass = '';

    return this;
  };

  /**
   * Change the modal's content
   * @param {Function} content - callback that returns a Template
   * @param {string} className - the class name of the container
   * @returns
   */
  push = (content, className = '') => {
    this.stack.push({ content, className });

    this.state.contentClass = className;
    this.state.content = content();
    this.open();

    return this;
  };

  /**
   * Change the modal's content by returning to previously shown content.
   * If no content remained, the modal will be closed
   * @returns
   */
  pop = () => {
    // remove top of the stack
    this.stack.pop();

    if (this.stack.length) {
      // show new top of stack

      const current = this.stack[this.stack.length - 1];
      this.state.contentClass = current?.className || '';
      this.state.content = current?.content?.() ?? [];
      this.open();
    } else {
      this.close();
    }

    return this;
  };
}

export default Modal;
