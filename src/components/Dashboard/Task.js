import { getDateKeyword } from '../../utils/date';
import Badge from '../Badge';
import GlobalTask from '../GlobalTask';

const Task = (data, showLastUpdate = false) => {
  const component = new GlobalTask(data);

  component.props.main = {
    ...component.props.main,
    class: `${component.props.main.class} rounded-md drop-shadow-md group`,
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
