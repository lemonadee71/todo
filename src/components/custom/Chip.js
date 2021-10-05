import App from '../../core';

class Chip extends HTMLElement {
  connectedCallback() {
    this.style.width = '30px'; // default width

    this.addEventListener('click', this._triggerExpand);
    this.render();
  }

  static get observedAttributes() {
    return ['show-text', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }

  _triggerExpand = () => {
    if (this.getAttribute('expandable') === 'true') {
      App.state.expandLabels = !App.state.expandLabels;
    }
  };

  render = () => {
    const showText = this.getAttribute('show-text');

    if (showText) {
      this.textContent = this.getAttribute('text');
    } else {
      this.textContent = '';
    }

    this.style.color = this.getAttribute('color');
    this._triggerExpand();
  };

  expand = () => {
    this.setAttribute('show-text', 'true');
  };
}

export default Chip;
