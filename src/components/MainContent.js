import Component from '../helpers/component';
import Modal from './Modal';
import $, { hide, show } from '../helpers/helpers';
import { currentTasks } from '../helpers/selectors';
import NoTasksMessage from './NoTasksMessage';

const MainContent = ({ onAddBtnClick }) => {
  const showCompleted = (e) => {
    if (e.target.checked) {
      show($('#completed-tasks'));
    } else {
      hide($('#completed-tasks'));
    }
  };

  const checkNoOfTasks = () => {
    let hasActiveTasks = $(currentTasks).children.length;
    let noTasks = $('#no-tasks');
    // console.log([...$(currentTasks).children]);
    // console.log(hasActiveTasks);
    if (hasActiveTasks) {
      if (noTasks) {
        $(currentTasks).removeChild($('#no-tasks'));
      }
    } else {
      if (!noTasks) {
        $(currentTasks).appendChild(NoTasksMessage());
      }
    }
  };

  return Component.parseString`
  <main>
    <div id="taskbar">
      <button id="add-task" ${{ onClick: onAddBtnClick }}>+</button>
      <label for="show">Show Completed</label>
      <input id="show-completed" type="checkbox" name="show" value="show" ${{
        onChange: showCompleted,
      }}/>
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
