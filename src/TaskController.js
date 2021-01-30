import Component from './component';
import TaskCard from './components/TaskCard';
import Task from './Task';
import $ from './helpers/helpers';
//         type: 'div',
//         text: format(task.dueDate, 'E..EEE, MMM dd'),
//       },

const createNewTask = (details, { deleteTask }) => {
  let newTask = new Task(details);
  return createTaskCard(newTask, { deleteTask });
};

const createTaskCard = (task, { deleteTask }) => {
  const editTask = () => {};

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
      toggleCheckmark,
      id: task.id,
    })
  );
};

export { createNewTask, createTaskCard };
