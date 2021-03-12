import List from '../classes/List';
import Label from '../classes/Label';
import { getAllTasks } from './projects';
import { defaultLabels } from './defaults';
import Storage from './storage';

const Labels = new List({ name: 'labels' });

const storedData = Storage.recover('labels');
if (storedData) {
  Labels.add(
    storedData._items.map((label) => {
      const { name, color, id } = label;
      return new Label(name, color, id);
    })
  );
} else {
  Labels.add(defaultLabels);
}

Storage.store('labels', Labels);

const syncData = () => Storage.sync('data');
const syncLabels = () => Storage.sync('labels');

const getLabels = () => Labels.items;

const getLabel = (id) => {
  const label = Labels.get((label) => label.id === id);

  if (!label) throw new Error(`No label with id: ${id}`);

  return label;
};

const addLabel = (name, color) => {
  let labelAlreadyExists = Labels.has((label) => label.name === name);

  if (labelAlreadyExists) {
    throw new Error('Label already exists.');
  }

  const newLabel = new Label(name, color);
  Labels.add(newLabel);

  syncLabels();

  return newLabel;
};

const deleteLabel = (id) => {
  Labels.delete((label) => label.id === id);
  getAllTasks().forEach((task) => task.removeLabel(id));

  syncLabels();
  syncData();
};

const editLabel = (id, prop, value) => {
  // This is to make sure all labels are edited
  getAllTasks().forEach((task) => {
    const taskLabel = task.labels.get((label) => label.id === id);
    if (taskLabel) {
      taskLabel[prop] = value;
    }
  });
  getLabel(id)[prop] = value;

  syncLabels();
  syncData();
};

export { addLabel, deleteLabel, editLabel, getLabel, getLabels };
