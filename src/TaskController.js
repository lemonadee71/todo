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
    e.target.classList.toggle('checked');
    e.stopPropagation();

    let done = task.toggleComplete();
    let taskCard = $(`#${task.id}`);
    taskCard.classList.toggle('completed');

    if (done) {
      $('#completed-tasks').appendChild(taskCard);
    } else {
      $('#current-tasks').appendChild(taskCard);
    }
  };

  return Component.render(
    TaskCard({
      onDelete,
      onToggle: toggleCheckmark,
      id: task.id,
      title: task.title,
      desc: task.desc,
      dueDate: task.dueDate,
    })
  );
};

export { createTaskCard };
