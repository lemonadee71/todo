import Component from './helpers/component';
import TaskCard from './components/TaskCard';
import $, {
  append,
  changeModalContent,
  hide,
  remove,
  show,
} from './helpers/helpers';
import { getProjectsDetails, getCurrentSelectedProj } from './controller';
import TaskModal from './components/TaskModal';
import {
  completedTasks,
  currentTasks,
  modal,
  taskCardDescription,
  taskCardDueDateText,
  taskCardDueDateIcon,
  taskCardTitle,
} from './helpers/selectors';
import { format } from 'date-fns';

// TODO: change the selectors
const createTaskCard = ({ task, deleteTask, transferTask }) => {
  // TaskModal Functions
  const updateTaskDetails = (prop, value) => {
    task[prop] = value;
  };

  const updateTitle = (e) => {
    updateTaskDetails('title', e.target.value);
    $(taskCardTitle(task.id)).textContent = task.title;
  };

  const updateDesc = () => {
    updateTaskDetails('desc', $('#edit-task-desc').value);

    let taskCardDesc = $(taskCardDescription(task.id));
    if (task.desc === '') {
      hide(taskCardDesc);
    } else {
      show(taskCardDesc);
    }
  };

  const updateDueDate = (e) => {
    updateTaskDetails('dueDate', e.target.value);

    let dueDateIcon = $(taskCardDueDateIcon(task.id));
    let dueDateText = $(taskCardDueDateText(task.id));

    if (task.dueDate === '') {
      hide(dueDateIcon);
      dueDateText.textContent = '';
    } else {
      show(dueDateIcon);
      dueDateText.textContent = format(task.dueDate, 'E, MMM dd');
    }
  };

  const changeTaskLocation = () => {
    task.location = $('proj select[name="project-list"]').value;
    transferTask(task.id, task.location);

    let currentLocation = getCurrentSelectedProj();

    if (currentLocation) {
      remove($(`#${task.id}`), true);
    }
  };

  // TaskCard functions
  const onEdit = () => {
    changeModalContent(
      TaskModal({
        task,
        updateTitle,
        updateDesc,
        updateDueDate,
        updateLocation: changeTaskLocation,
        projects: getProjectsDetails(),
      })
    );
    show($(modal));
  };

  const onDelete = () => {
    deleteTask(task);
    let list = task.completed ? completedTasks : currentTasks;
    remove($(`#${task.id}`)).from($(list));
  };

  const toggleCheckmark = (e) => {
    if (e.target.matches('div.check')) {
      e.target.classList.toggle('checked');
    } else if (e.target.matches('.checkmark')) {
      e.target.parentElement.classList.toggle('checked');
    }

    let isDone = task.toggleComplete();
    let taskCard = $(`#${task.id}`);
    taskCard.classList.toggle('completed');

    if (isDone) {
      append(taskCard).to($(completedTasks));
    } else {
      append(taskCard).to($(currentTasks));
    }
  };

  return Component.render(
    TaskCard({
      task,
      onDelete,
      onEdit,
      onToggle: toggleCheckmark,
    })
  );
};

export { createTaskCard };
