import App from '../../core';

class Chip extends HTMLElement {
  constructor() {
    super();
    this.expand = this.expand.bind(this);
  }

  connectedCallback() {



    this.addEventListener('click', () => {
      if (this.getAttribute('expandable')) {
        AppEvent.emit('label-chip.expand');
      }
    });

    this.render();
  }

  disconnectedCallback() {
    // AppEvent.off('label-chip.expand', this.expand);
  }

  static get observedAttributes() {
    return ['show-text', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const showText = this.getAttribute('show-text');

    if (showText) {
      this.textContent = this.getAttribute('text');
    } else {
      this.textContent = '';
    }
  }

  expand() {
    console.log('show-text', !!this.getAttribute('show-text'));
    if (this.getAttribute('show-text')) {
      this.removeAttribute('show-text');
    } else {
      this.setAttribute('show-text', '');
    }

    // this.setAttribute('show-text', !!this.getAttribute('show-text'));
  }
}

export default Chip;
