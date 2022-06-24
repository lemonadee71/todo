import { DEFAULT_COLORS } from '../constants';
import Badge from './Badge';
import GlobalTask from './GlobalTask';

const SearchResult = (data, isBestMatch = false) => {
  const component = new GlobalTask(data);

  if (isBestMatch) {
    component.badges.unshift(
      Badge({
        content: 'Best match',
        bgColor: DEFAULT_COLORS.blue,
        props: { key: 'best-match' },
      })
    );
  }

  return component.render();
};

export default SearchResult;
