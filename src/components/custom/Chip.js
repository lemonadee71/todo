import event from '../../modules/event';

class Chip extends HTMLElement {
  constructor() {
    super();
    this.expandLabel = this.expandLabel.bind(this);
  }

  connectedCallback() {
    event.on('label-chip.expand', this.expandLabel);

    this.addEventListener('click', () => {
      if (this.getAttribute('expandable')) {
        event.emit('label-chip.expand');
      }
    });

    this.render();
  }

  disconnectedCallback() {
    event.off('label-chip.expand', this.expandLabel);
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

  expandLabel() {
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
