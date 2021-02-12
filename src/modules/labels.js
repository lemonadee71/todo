import List from '../classes/List.js';
import Label from '../classes/Label.js';
import { getAllProjects } from './controller';
import { defaultLabels } from '../helpers/defaults.js';

const labels = new List('labels', 'list', defaultLabels);

const addLabel = (name, color) => {
  let alreadyExists = labels.getItem((label) => label.name === name);

  if (!alreadyExists) {
    labels.addItem(new Label(name, color));
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
};

const editLabel = (id, prop, value) => {
  labels.getItem((label) => label.id === id)[prop] = value;
};

const getLabels = () => labels.items;

export { addLabel, deleteLabel, editLabel, getLabels };
