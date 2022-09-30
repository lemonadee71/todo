import { html, render, createHook } from 'poor-man-jsx';
import Core from '../../core';

class Modal extends HTMLElement {
  /* eslint-disable */
  #removePageTracking;
  #previousActiveElement;
  #closeAction;
  /* eslint-enable */

  constructor() {
    super();
    this.stack = [];
    this.state = createHook({
      // initial value
      // this is for modals that have static content
      content: html`${[...this.children]}`,
      contentClass: '',
      contentName: '',
    });

    // hide on creation
    this.style.display = 'none';

    this.#closeAction = this.getAttribute('close-action') ?? 'hide';
  }

  connectedCallback() {
    // close modal if the page changed
    this.#removePageTracking = Core.router.on('*', this.hide);

    // clear content if we have initial value
    this.innerHTML = '';

    this.append(
      render(html`
        <div
          class="fixed top-0 left-0 w-full h-full z-50 overflow-auto ${this
            .state.$contentClass}"
          data-name="dialog__content"
          onClick=${(e) => {
            if (e.target === e.currentTarget) this[this.#closeAction]?.();
          }}
        >
          ${this.state.$content((value) => render(value))}
        </div>
        <div
          class="fixed top-0 left-0 w-full h-full bg-[rgba(102,102,102,0.4)] z-40"
          data-name="dialog__mask"
        ></div>
      `)
    );
  }

  disconnectedCallback() {
    this.#removePageTracking();
  }

  // our modal is always labelled by its content
  #setAriaLabel = (label) => {
    this.removeAttribute('aria-labelledby');
    if (label) this.setAttribute('aria-labelledby', label);
  };

  #checkHideModal = (e) => {
    if (e.key === 'Escape') this[this.#closeAction]?.();
  };

  open = (action = 'next') => {
    this.style.display = 'block';

    // make all siblings inert
    // so they are unfocusable
    [...document.body.children].forEach((child) => {
      if (child !== this) child.inert = true;
    });

    document.addEventListener('keydown', this.#checkHideModal);

    // if no target, get the first button
    const firstFocusTarget =
      this.querySelector('[data-focus="first"]') ??
      this.querySelector('button');

    if (action === 'next') {
      // grab ref so we can restore focus on close
      this.#previousActiveElement = document.activeElement;

      // transfer focus to first target
      firstFocusTarget?.focus();
    } else {
      // if action is previous
      // we focus the stored previous active element instead
      this.#previousActiveElement?.focus();
    }

    return this;
  };

  hide = () => {
    this.style.display = 'none';

    [...document.body.children].forEach((child) => {
      if (child !== this) child.inert = false;
    });

    document.removeEventListener('keydown', this.#checkHideModal);

    // restore focus
    this.#previousActiveElement?.focus();

    return this;
  };

  /**
   * Clear content and state of modal
   * @returns
   */
  clear = () => {
    this.stack = [];
    this.state.content = [];
    this.state.contentClass = '';
    this.removeAttribute('aria-labelledby');

    return this;
  };

  /**
   * Hides and clears content and state of modal.
   * This will bypass all stacked content and immediately close the modal
   * @returns
   */
  close = () => this.hide().clear();

  /**
   * Change the modal's content. Use for dynamic and stacking content
   * @param {Function} content - callback that returns a Template
   * @param {string} className - the class name of the container
   * @param {string} contentName - the value for aria-labelledby
   * @returns
   */
  push = (content, className = '', contentName = '') => {
    this.stack.push({
      content,
      className,
      contentName,
      // store ref so we can preserve focus
      // even when going through the stack
      prevActiveElement: document.activeElement,
    });

    this.state.content = content();
    this.state.contentClass = className;
    this.#setAriaLabel(contentName);
    this.open();

    return this;
  };

  /**
   * Change the modal's content by returning to previously shown content.
   * If no content remained, the modal will be closed and cleared.
   * @returns
   */
  pop = () => {
    // remove top of the stack
    const top = this.stack.pop();
    this.#previousActiveElement = top?.prevActiveElement;

    if (this.stack.length) {
      // show new top of stack
      const current = this.stack[this.stack.length - 1];
      this.state.contentClass = current?.className || '';
      this.state.content = current?.content?.() ?? [];
      this.#setAriaLabel(current?.contentName);

      this.open('prev');
    } else {
      this.close();
    }

    return this;
  };
}

export default Modal;
