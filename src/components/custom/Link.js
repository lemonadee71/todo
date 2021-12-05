import Core from '../../core';
import { NAVIGATE_TO_PAGE } from '../../core/actions';

class Link extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || '';
      const store = this.getAttribute('store') ?? 'true';

      // do not navigate if href matchesthe previous path
      if (Core.router.matchLocation(href)) return;

      if (title) document.title = title;
      if (store === 'true') Core.event.emit(NAVIGATE_TO_PAGE, { title, href });

      Core.router.navigate(href, { title });
    });
  }
}

export default Link;
