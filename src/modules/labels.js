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

const getLabel = (id) => Labels.get((label) => label.id === id);

const addLabel = (name, color) => {
  let labelDoesNotExist = !Labels.has((label) => label.name === name);

  if (labelDoesNotExist) {
    const newLabel = new Label(name, color);
    Labels.add(newLabel);

    syncLabels();
    return newLabel;
  } else {
    throw new Error('Label already exists.');
  }
};

const deleteLabel = (id) => {
  Labels.delete((label) => label.id === id);
  getAllTasks().forEach((task) => task.removeLabel(id));

  syncLabels();
  syncData();
};

const editLabel = (id, prop, value) => {
  getLabel(id)[prop] = value;

  syncLabels();
  syncData();
};

export { addLabel, deleteLabel, editLabel, getLabel, getLabels };
