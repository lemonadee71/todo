import Component from '../helpers/component';

const NoTasksMessage = () =>
   Component.createElementFromString(
      `<h3 id="no-tasks">You don't have any tasks</h3>`
   );

export default NoTasksMessage;
