import Component from './helpers/component';
import TaskCard from './components/TaskCard';
import $, { changeModalContent, hide, show } from './helpers/helpers';
import { getProjectsDetails, getCurrentSelectedProj } from './controller';
import TaskModal from './components/TaskModal';

// TODO: change the selectors
const createTaskCard = ({ task, deleteTask, transferTask }) => {
  // TaskModal Functions
  const updateTitle = (e) => {
    task.title = e.target.value;
    $(`--data-name=title-${task.id}`).textContent = task.title;
  };

  const updateDesc = () => {
    task.desc = $('#edit-task-desc').value;

    let taskCardDesc = $(`--data-name=desc-${task.id}`);
    if (task.desc === '') {
      hide(taskCardDesc);
    } else {
      show(taskCardDesc);
    }
  };

  const updateDueDate = (e) => {
    task.dueDate = e.target.value;

    let taskCardDate = $(`--data-name=date-${task.id}`);
    if (task.dueDate === '') {
      hide(taskCardDate);
    } else {
      // Needs rerender to show
      show(taskCardDate);
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
      onEdit,
      onToggle: toggleCheckmark,
    })
  );
};

export { createTaskCard };
