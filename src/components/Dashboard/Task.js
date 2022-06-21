import { getDateKeyword } from '../../utils/date';
import Badge from '../Badge';
import GlobalTask from '../GlobalTask';

const Task = (data, showLastUpdate = false) => {
  const component = new GlobalTask(data);

  component.props.main = {
    class: `${component._className} rounded-md drop-shadow-md group`,
  };
  component.props.openBtn = {
    class: `${component.props.openBtn.class} invisible group-hover:visible`,
  };

  if (showLastUpdate) {
    component.badges.unshift(
      Badge({
        content: `Last update: ${getDateKeyword(data.lastUpdate)}`,
        bgColor: 'transparent',
        additionalCls: 'px-0 text-xs text-gray-400 dark:text-gray-300',
        props: { key: 'last-update' },
      })
    );
  }

  return component.render();
};

export default Task;
