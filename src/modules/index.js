import * as projects from './projects';
import * as labels from './labels';
import Storage from './storage';
import Task from '../classes/Task';
import { AppEvent } from '../emitters';

const labelAddHandler = ({ name, color }) => labels.addLabel(name, color);

const labelDeleteHandler = ({ id }) => labels.deleteLabel(id);

const labelEditHandler = ({ id, prop, value }) => {
  labels.editLabel(id, prop, value);
  return { id, newName: value };
};

const projectAddHandler = ({ name }) => projects.addProject(name);

const projectDeleteHandler = ({ id }) => projects.deleteProject(id);

const taskAddHandler = (info) => {
  const task = new Task(info);
  projects.addTask(task);

  return task.data;
};

const taskDeleteHandler = (task) => projects.deleteTask(task);

const taskUpdateHandler = ({ info, data }) => {
  const task = projects.getTask(info.location, info.id);

  Object.entries(data).forEach(([prop, value]) => {
    task[prop] = value;
    AppEvent.emit('task.update.success', {
      prop,
      id: info.id,
      data: { [prop]: value },
    });
  });
};

const taskTransferHandler = ({ id, prevLocation, newLocation }) => {
  projects.transferTask(id, prevLocation, newLocation);

  return { id, newLocation };
};

const taskLabelsHandler = ({ info, action, labelId }) => {
  const task = projects.getTask(info.location, info.id);
  if (action === 'add') {
    task.addLabel(labels.getLabel(labelId));
  } else if (action === 'remove') {
    task.removeLabel(labelId);
  }
};

const initializeEvents = () => {
  AppEvent.on('label.add', labelAddHandler);
  AppEvent.on('label.delete', labelDeleteHandler);
  AppEvent.on('label.edit', labelEditHandler);
  AppEvent.on('project.add', projectAddHandler);
  AppEvent.on('project.delete', projectDeleteHandler);
  AppEvent.on('task.add', taskAddHandler);
  AppEvent.on('task.delete', taskDeleteHandler);
  AppEvent.on('task.update', taskUpdateHandler);
  AppEvent.on('task.transfer', taskTransferHandler);
  AppEvent.on('task.labels.update', taskLabelsHandler);
  AppEvent.on(/^(task|project)(.labels)?.\w+$/, () => Storage.sync('data'));
  AppEvent.on(/^label.\w+$/, () => {
    Storage.sync('data');
    Storage.sync('labels');
  });
};

export default initializeEvents;
