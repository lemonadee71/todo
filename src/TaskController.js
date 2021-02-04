import Component from './helpers/component';
import TaskItem from './components/TaskItem';
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
  taskItemDescription,
  taskItemDueDateText,
  taskItemDueDateIcon,
  taskItemTitle,
} from './helpers/selectors';
import { format } from 'date-fns';

// TODO: change the selectors
const createTaskCard = ({ task, deleteTask, transferTask }) => {
  // TaskModal Functions
  const _updateTaskDetails = (prop, value) => {
    task[prop] = value;
  };

  const updateTitle = (e) => {
    _updateTaskDetails('title', e.target.value);
    $(taskItemTitle(task.id)).textContent = task.title;
  };

  const updateDesc = () => {
    _updateTaskDetails('desc', $('#edit-task-desc').value);

    let taskCardDesc = $(taskItemDescription(task.id));
    if (task.desc === '') {
      hide(taskCardDesc);
    } else {
      show(taskCardDesc);
    }
  };

  const updateDueDate = (e) => {
    _updateTaskDetails('dueDate', e.target.value);

    let dueDateIcon = $(taskItemDueDateIcon(task.id));
    let dueDateText = $(taskItemDueDateText(task.id));

    if (task.dueDate === '') {
      hide(dueDateIcon);
      dueDateText.textContent = '';
    } else {
      show(dueDateIcon);
      dueDateText.textContent = format(task.dueDate, 'E, MMM dd');
    }
  };

  const changeTaskLocation = (e) => {
    let prevLocation = task.location;
    let newLocation = e.currentTarget.value;

    _updateTaskDetails('location', newLocation);
    transferTask(task.id, prevLocation, newLocation);

    let currentLocation = getCurrentSelectedProj();

    if (currentLocation) {
      remove($(`#${task.id}`), true);
    }
  };

  // TaskItem functions
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
    e.currentTarget.classList.toggle('checked');

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
    TaskItem({
      task,
      onDelete,
      onEdit,
      onToggle: toggleCheckmark,
    })
  );
};

export { createTaskCard };
