import * as projects from './projects';
import * as labels from './labels';
import Storage from './storage';
import Task from '../classes/Task';
import { AppEvent } from '../emitters';

const labelAddHandler = ({ name, color }) => {
  const newLabel = labels.addLabel(name, color);
  AppEvent.emit('label.add.success', newLabel);
  AppEvent.emit('storage.sync', 'labels');
};

const labelDeleteHandler = ({ id }) => {
  labels.deleteLabel(id);
  AppEvent.emit('storage.sync', 'data');
  AppEvent.emit('storage.sync', 'labels');
};

const labelEditHandler = ({ id, prop, value }) => {
  labels.editLabel(id, prop, value);
  AppEvent.emit('label.edit.success', { id, newName: value });
  AppEvent.emit('storage.sync', 'data');
  AppEvent.emit('storage.sync', 'labels');
};

const projectAddHandler = ({ name }) => {
  try {
    const newProject = projects.addProject(name);
    AppEvent.emit('project.add.success', newProject);
    AppEvent.emit('storage.sync', 'data');
  } catch (error) {
    AppEvent.emit('project.add.error', error);
  }
};

const projectDeleteHandler = ({ id }) => {
  projects.deleteProject(id);
  AppEvent.emit('storage.sync', 'data');
};

const taskAddHandler = (info) => {
  const task = new Task(info);
  projects.addTask(task);

  AppEvent.emit('task.add.success', task.data);
  AppEvent.emit('storage.sync', 'data');
};

const taskDeleteHandler = (task) => {
  projects.deleteTask(task);
  AppEvent.emit('storage.sync', 'data');
};

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

  AppEvent.emit('storage.sync', 'data');
};

const taskTransferHandler = ({ id, prevLocation, newLocation }) => {
  projects.transferTask(id, prevLocation, newLocation);

  AppEvent.emit('task.transfer.success', { id, newLocation });
  AppEvent.emit('storage.sync', 'data');
};

const taskLabelsHandler = ({ info, action, labelId }) => {
  const task = projects.getTask(info.location, info.id);
  if (action === 'add') {
    task.addLabel(labels.getLabel(labelId));
  } else if (action === 'remove') {
    task.removeLabel(labelId);
  }
  AppEvent.emit('storage.sync', 'data');
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
  AppEvent.on('storage.sync', (key) => Storage.sync(key));
};

export default initializeEvents;
