import Component from '../helpers/component';
import $, { hide, show, changeModalContent } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  tasksList,
  modal,
} from '../helpers/selectors';
import CreateTaskForm from './CreateTaskForm';
import NoTasksMessage from './NoTasksMessage';
import Modal from './Modal';

const MainContent = () => {
  const showCompleted = (e) => {
    if (e.target.checked) {
      show($(completedTasks));
    } else {
      hide($(completedTasks));
    }
  };

  const checkNoOfTasks = () => {
    let hasActiveTasks = $(currentTasks).children.length;
    let noTasks = $('#no-tasks');

    if (hasActiveTasks) {
      if (noTasks) {
        $(tasksList).removeChild(noTasks);
      }
    } else {
      if (!noTasks) {
        $(tasksList).prepend(NoTasksMessage());
      }
    }
  };

  const showCreateTaskForm = () => {
    changeModalContent(Component.render(CreateTaskForm()));
    show($(modal));
  };

  return Component.parseString`
  <main>
    <div id="taskbar">
      <button id="add-task" ${{ onClick: showCreateTaskForm }}>+</button>
      <label for="show">Show Completed</label>
      <input id="show-completed" type="checkbox" name="show" value="show" 
      ${{ onChange: showCompleted }}
      />
    </div>
    <div id="tasks-list" ${{
      onChildRemoved: checkNoOfTasks,
      onChildAdded: checkNoOfTasks,
    }}>
      <div id="current-tasks"></div>
      <div id="completed-tasks" style="display: none;"></div>
    </div>
    ${Modal()}
  </main>
  `;
};

export default MainContent;
