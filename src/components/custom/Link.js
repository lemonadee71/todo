import Core from '../../core';

class Link extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      Core.router.navigate(this.getAttribute('href'));
    });
  }
}

export default Link;
