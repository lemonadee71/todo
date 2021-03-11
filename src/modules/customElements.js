import Component from '../helpers/component';

class Modal extends HTMLElement {
  constructor() {
    super();
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.clearContent = this.clearContent.bind(this);
  }

  connectedCallback() {
    this.classList.add('modal-backdrop');

    let element = Component.html`
      <div id="modal">
        <span class="close" ${{ onClick: this.close }}>&times;</span>
        <div id="modal-content"></div>
      </div>
    `;

    this.appendChild(Component.render(element));
  }

  show() {
    this.style.display = 'block';

    return this;
  }

  close() {
    this.style.display = 'none';
    this.clearContent();

    return this;
  }

  changeContent(content) {
    const isTemplate = (val) => val._type && val._type === 'template';
    const modalContent = this.querySelector('#modal-content');

    this.clearContent();

    if (isTemplate(content)) {
      modalContent.appendChild(Component.render(content));
    } else {
      modalContent.appendChild(content);
    }

    return this;
  }

  clearContent() {
    const modalContent = this.querySelector('#modal-content');

    while (modalContent.firstElementChild) {
      modalContent.removeChild(modalContent.lastElementChild);
    }

    return this;
  }
}

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
      this.className = 'chip-w-text';
      this.textContent = this.getAttribute('text');
    } else {
      this.className = 'chip';
      this.textContent = '';
    }
  }
}

class EditButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML = '<img src="icons/edit.svg" class="edit" alt="edit" />';
  }
}

class DeleteButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML =
      '<img src="icons/delete.svg" class="delete" alt="delete" />';
  }
}

const defineCustomElements = () => {
  customElements.define('modal-el', Modal);
  customElements.define('chip-el', Chip);
  customElements.define('edit-btn', EditButton, { extends: 'button' });
  customElements.define('delete-btn', DeleteButton, { extends: 'button' });
};

export default defineCustomElements;