import { DEFAULT_COLORS } from '../constants';
import { runOnlyIfClick } from '../utils/misc';
import Badge from './Badge';
import GlobalTask from './GlobalTask';

const SearchResult = (data, isBestMatch = false) => {
  const component = new GlobalTask(data);

  component.props.main = {
    ...component.props.main,
    class: `${component.props.main.class} group`,
    tabindex: '-1',
    onKeydown: (e) => {
      runOnlyIfClick(component.openOnLocation)(e);
      // if tab is pressed, we're leaving the task
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.target.setAttribute('tabindex', '-1');
      }
    },
  };
  component.props.openBtn = { 'data-name': 'open' };

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
