import * as projects from './projects';
import * as labels from './labels';
import Storage from './storage';
import event from './event';
import Task from '../classes/Task';

const labelAddHandler = ({ name, color }) => {
  const newLabel = labels.addLabel(name, color);
  event.emit('label.add.success', newLabel);
  event.emit('storage.sync', 'labels');
};

const labelDeleteHandler = ({ id }) => {
  labels.deleteLabel(id);
  event.emit('storage.sync', 'data');
  event.emit('storage.sync', 'labels');
};

const labelEditHandler = ({ id, prop, value }) => {
  labels.editLabel(id, prop, value);
  event.emit('storage.sync', 'data');
  event.emit('storage.sync', 'labels');
};

const projectAddHandler = ({ name }) => {
  try {
    const newProject = projects.addProject(name);
    event.emit('project.add.success', newProject);
    event.emit('storage.sync', 'data');
  } catch (error) {
    event.emit('project.add.error', error);
  }
};

const projectDeleteHandler = ({ id }) => {
  projects.deleteProject(id);
  event.emit('storage.sync', 'data');
};

const taskAddHandler = (info) => {
  const task = new Task(info);
  projects.addTask(task);

  event.emit('task.add.success', task.getData());
  event.emit('storage.sync', 'data');
};

const taskDeleteHandler = (task) => {
  projects.deleteTask(task);
  event.emit('storage.sync', 'data');
};

const taskUpdateHandler = ({ info, data }) => {
  const task = projects.getTask(info.location, info.id);

  Object.entries(data).forEach(([prop, value]) => {
    task[prop] = value;
    event.emit('task.update.success', {
      prop,
      id: info.id,
      data: { [prop]: value },
    });
  });

  event.emit('storage.sync', 'data');
};

const taskTransferHandler = ({ id, prevLocation, newLocation }) => {
  projects.transferTask(id, prevLocation, newLocation);

  event.emit('task.transfer.success', { id, newLocation });
  event.emit('storage.sync', 'data');
};

const taskLabelsHandler = ({ info, action, labelId }) => {
  const task = projects.getTask(info.location, info.id);
  if (action === 'add') {
    task.addLabel(labels.getLabel(labelId));
  } else if (action === 'remove') {
    task.removeLabel(labelId);
  }
  event.emit('storage.sync', 'data');
};

const initializeEvents = () => {
  event.on('label.add', labelAddHandler);
  event.on('label.delete', labelDeleteHandler);
  event.on('label.edit', labelEditHandler);
  event.on('project.add', projectAddHandler);
  event.on('project.delete', projectDeleteHandler);
  event.on('task.add', taskAddHandler);
  event.on('task.delete', taskDeleteHandler);
  event.on('task.update', taskUpdateHandler);
  event.on('task.transfer', taskTransferHandler);
  event.on('task.labels.update', taskLabelsHandler);
  event.on('storage.sync', (key) => Storage.sync(key));
};

export default initializeEvents;
