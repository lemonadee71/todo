import { TASK } from '../../actions';
import BaseTask from './BaseTask';

const Subtask = (data, i, variant) => {
  const component = new BaseTask(data, TASK.SUBTASKS);

  component.props.main = {
    ...component.props.main,
    // remove and reduce padding
    class: component.props.main.class
      .replace(/px-[0-9]+/, '')
      .replace(/py-[0-9]+/, 'py-1'),
    'data-parent': data.parent,
  };

  if (variant === 'small') {
    // for customization, this type isn't really scaleable
    // since it requires us to know which styles were there in the first place
    // one way is to just append the classes since it will override
    // earlier classes anyway
    Object.assign(component.props, {
      title: {
        class: component.props.title.class.replace('text-base', 'text-sm'),
      },
      checkbox: {
        class: component.props.checkbox.class.replace('w-5 h-5', 'w-4 h-4'),
      },
      checkmark: {
        class: component.props.checkmark.class.replace('w-3 h-3', 'w-2 h-2'),
      },
    });
  }

  return component.render(i);
};

export default Subtask;
