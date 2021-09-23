import { html, render, createHook } from 'poor-man-jsx';

class Modal extends HTMLDivElement {
  constructor() {
    super();
    this.state = createHook({ content: null });

    this.defaultStyle = {
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
  }

  connectedCallback() {
    Object.assign(this.style, this.defaultStyle);

    const element = html`
      <div role="modal">
        <span role="modal__close-btn" ${{ onClick: this.close }}>&times;</span>
        <div role="modal__content" ${{ $children: this.state.$content }}></div>
      </div>
    `;

    render(element, this);
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

  changeContent = (content) => {
    this.state.content = content;

    return this;
  };

  clearContent = () => {
    this.state.content = null;

    return this;
  };
}

export default Modal;
