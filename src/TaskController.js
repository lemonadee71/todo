import Component from './helpers/component';
import TaskCard from './components/TaskCard';
import Task from './Task';
import $ from './helpers/helpers';
import { selectAllTasks } from './controller';
//         type: 'div',
//         text: format(task.dueDate, 'E..EEE, MMM dd'),
//       },

const createTaskCard = ({ task, editTask, deleteTask }) => {
  const onEdit = () => {};

  const onDelete = () => {
    deleteTask(task);
    $(`#${task.id}`).remove();
  };

  const toggleCheckmark = (e) => {
    if (e.target.matches('div.check')) {
      e.target.classList.toggle('checked');
    } else if (e.target.matches('.checkmark')) {
      e.target.parentElement.classList.toggle('checked');
    }

    e.stopPropagation();

    let isDone = task.toggleComplete();
    let taskCard = $(`#${task.id}`);
    taskCard.classList.toggle('completed');

    if (isDone) {
      $('#completed-tasks').appendChild(taskCard);
    } else {
      $('#current-tasks').appendChild(taskCard);
    }
  };

  return Component.render(
    TaskCard({
      task,
      onDelete,
      onToggle: toggleCheckmark,
    })
  );
};

export { createTaskCard };
