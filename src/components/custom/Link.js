import Core from '../../core';

class Link extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      const href = this.getAttribute('href');

      // do not navigate if href matches
      // the previous path
      if (Core.router.matchLocation(href)) return;

      Core.router.navigate(href);
    });
  }
}

export default Link;
