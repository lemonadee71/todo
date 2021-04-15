class Chip extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['expanded', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const expanded = this.getAttribute('expanded');
    const isExpanded = expanded && expanded === 'true';

    if (isExpanded) {
      // this.className = 'chip-w-text';
      this.textContent = this.getAttribute('text');
    } else {
      // this.className = 'chip';
      this.textContent = '';
    }
  }
}

export default Chip;
