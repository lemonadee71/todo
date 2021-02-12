import Component from '../helpers/component';
import TaskItem from '../components/TaskItem';
import $, {
  append,
  changeModalContent,
  hide,
  remove,
  show,
} from '../helpers/helpers';
import { getProjectsDetails, getCurrentSelectedProj } from './controller';
import TaskModal from '../components/TaskModal';
import {
  completedTasks,
  currentTasks,
  modal,
  taskItemNotes,
  taskItemDueDateText,
  taskItemDueDateIcon,
  taskItemTitle,
  taskItemLabels,
  labelsArea,
  chips,
  chipsWithText,
} from '../helpers/selectors';
import { format } from 'date-fns';
import Chip from '../components/Chip';
import { getLabel } from './labels';

// TODO: change the selectors
const createTaskItem = ({ task, deleteTask, transferTask }) => {
  // TaskModal Functions
  const _updateTaskDetails = (prop, value) => {
    task[prop] = value;
  };

  const _updateTaskLabels = (method, id) => {
    if (method === 'add') {
      task.addLabel(getLabel(id));
    } else if (method === 'remove') {
      task.removeLabel(id);
    }
  };

  const updateTitle = (e) => {
    _updateTaskDetails('title', e.target.value);
    $(taskItemTitle(task.id)).textContent = task.title;
  };

  const updateNotes = () => {
    _updateTaskDetails('notes', $('#edit-task-notes').value);

    let taskCardNotes = $(taskItemNotes(task.id));
    if (task.notes === '') {
      hide(taskCardNotes);
    } else {
      show(taskCardNotes);
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

  // This is a mess
  const updateLabels = (e) => {
    let target = e.currentTarget;
    let labelId = target.getAttribute('data-label-id');
    let labelColor = target.getAttribute('data-color');
    let labelName = target.firstElementChild.value;

    target.classList.toggle('selected');

    if (target.className.includes('selected')) {
      _updateTaskLabels('add', labelId);

      append(Component.createElementFromString(Chip(labelId, labelColor))).to(
        $(taskItemLabels(task.id))
      );
      append(
        Component.createElementFromString(Chip(labelId, labelColor, labelName))
      ).to($(labelsArea));
    } else {
      _updateTaskLabels('remove', labelId);

      remove($(`#${task.id} ${chips(labelId)}`)).from(
        $(taskItemLabels(task.id))
      );
      remove($(chipsWithText(labelId))).from($(labelsArea));
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
        updateLabels,
        updateNotes,
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

export { createTaskItem };
