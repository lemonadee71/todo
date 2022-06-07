import { html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../constants';
import Badge from './Badge';
import GlobalTask from './GlobalTask';

const SearchResult = (data, isBestMatch = false) => {
  const component = new GlobalTask(data);

  if (isBestMatch) {
    component.badges.unshift(
      Badge({
        content: 'Best match',
        bgColor: DEFAULT_COLORS[5],
        props: { key: 'best-match' },
      })
    );
  }

  component.template.push({
    target: 'main',
    method: 'after',
    template: html`
      <button
        class="px-2 py-1 rounded text-white text-sm bg-sky-500 hover:bg-sky-600"
        onClick=${component.openOnLocation}
      >
        Open
      </button>
    `,
  });

  return component.render();
};

export default SearchResult;
