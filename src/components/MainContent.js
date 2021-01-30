import Component from '../component';
import Modal from './Modal';

const MainContent = () => {
  return Component.parseString`
  <main>
    <div id="taskbar">
      <button id="add-task">+</button>
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
