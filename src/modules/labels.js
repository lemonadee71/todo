import List from '../classes/List';
import Label from '../classes/Label';
import { getAllProjects } from './projects';
import { defaultLabels } from './defaults';
import Storage from './storage';

// const labels = Storage.register('labels', new List('labels'));
const labels = new List('labels');

let storedData = Storage.recover('labels');
if (storedData) {
  labels.addItem(
    storedData.items.map(
      (label) => new Label(label.name, label.color, label.id)
    )
  );
} else {
  labels.addItem(defaultLabels);
}

Storage.store('labels', labels);

const syncData = () => Storage.sync('labels');

const addLabel = (name, color) => {
  let alreadyExists = labels.getItem((label) => label.name === name);

  if (!alreadyExists) {
    let newLabel = new Label(name, color);
    labels.addItem(newLabel);

    syncData();
    return newLabel;
  } else {
    throw new Error('Label already exists.');
  }
};

const deleteLabel = (id) => {
  getAllProjects()
    .map((proj) => proj.items)
    .flat()
    .forEach((task) => task.removeLabel(id));

  labels.removeItems((label) => label.id === id);

  syncData();
};

const editLabel = (id, prop, value) => {
  labels.getItem((label) => label.id === id)[prop] = value;

  syncData();
};

const getLabels = () => labels.items;

const getLabel = (id) => labels.getItem((label) => label.id === id);

export { addLabel, deleteLabel, editLabel, getLabel, getLabels };
