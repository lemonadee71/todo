import Component from './component';
import TaskCard from './components/TaskCard';
import Task from './Task';
import $ from './helpers/getElement';
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
    let taskCard = $(`#${task.id}`);

    deleteTask(task);
    taskCard.remove();
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

  return TaskCard({
    onDelete,
    toggleCheckmark,
    id: task.id,
  });
};

export { createNewTask, createTaskCard };
