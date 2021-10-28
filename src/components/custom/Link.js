import Core from '../../core';
import { NAVIGATE_TO_PAGE } from '../../core/actions';

class Link extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || '';

      // do not navigate if href matches
      // the previous path
      if (Core.router.matchLocation(href)) return;

      if (title) {
        document.title = title;
      }

      Core.router.navigate(href, { title });
      Core.event.emit(NAVIGATE_TO_PAGE, href);
    });
  }
}

export default Link;
