import Component from '../helpers/component';
import Modal from './Modal';
import $, { hide, show } from '../helpers/helpers';

const MainContent = ({ onAddBtnClick }) => {
  const showCompleted = (e) => {
    if (e.target.checked) {
      show($('#completed-tasks'));
    } else {
      hide($('#completed-tasks'));
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
    <div id="tasks-list">
      <div id="current-tasks"></div>
      <div id="completed-tasks" style="display: none;"></div>
    </div>
    ${Modal()}
  </main>
  `;
};

export default MainContent;
