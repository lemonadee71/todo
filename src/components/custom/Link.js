import Core from '../../core';

class Link extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || this.textContent.trim();

      // do not navigate if href matches the previous path
      if (Core.router.matchLocation(href)) return;

      Core.router.navigate(href, { title });
    });
  }
}

export default Link;
