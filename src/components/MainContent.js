import Component from '../helpers/component';
import Modal from './Modal';

const MainContent = ({ onAddBtnClick }) => {
  return Component.parseString`
  <main>
    <div id="taskbar">
      <button id="add-task" ${{ onClick: onAddBtnClick }}>+</button>
      <label for="show">Show Completed</label>
      <input id="show-completed" type="checkbox" name="show" value="show"/>
    </div>
    <div id="tasks-list">
      <div id="current-tasks"></div>
      <div id="completed-tasks"></div>
    </div>
    ${Modal()}
  </main>
  `;
};

export default MainContent;
