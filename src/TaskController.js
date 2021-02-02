import Component from './helpers/component';
import TaskCard from './components/TaskCard';
import $, { changeModalContent, hide, remove, show } from './helpers/helpers';
import { getProjectsDetails, getCurrentSelectedProj } from './controller';
import TaskModal from './components/TaskModal';
import {
  completedTasks,
  currentTasks,
  taskCardDescription,
  taskCardDueDateText,
  taskCardTitle,
} from './helpers/selectors';
import { format } from 'date-fns';

// TODO: change the selectors
const createTaskCard = ({ task, deleteTask, transferTask }) => {
  // TaskModal Functions
  const updateTitle = (e) => {
    task.title = e.target.value;
    $(taskCardTitle(task.id)).textContent = task.title;
  };

  const updateDesc = () => {
    task.desc = $('#edit-task-desc').value;

    let taskCardDesc = $(taskCardDescription(task.id));
    if (task.desc === '') {
      hide(taskCardDesc);
    } else {
      show(taskCardDesc);
    }
  };

  const updateDueDate = (e) => {
    task.dueDate = e.target.value;

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
      $(`#${task.id}`).remove();
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
    show($('.modal-backdrop'));
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

    e.stopPropagation();

    let isDone = task.toggleComplete();
    let taskCard = $(`#${task.id}`);
    taskCard.classList.toggle('completed');

    if (isDone) {
      $(completedTasks).appendChild(taskCard);
    } else {
      $(currentTasks).appendChild(taskCard);
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
